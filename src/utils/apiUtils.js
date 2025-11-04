export const MAX_SEARCH_DEPTH = 10

export const parseRichText = (richText) => {
  if (typeof richText === "string") return richText
  if (richText.text) return richText.text
  if (Array.isArray(richText)) {
    return richText
      .map((item) => {
        if (typeof item === "string") return item
        if (item.value) return item.value
        if (item.text) return item.text
        return String(item)
      })
      .join(" ")
  }
  return String(richText)
}

export const findContentByType = (localeContent, targetType) => {
  const welcome = localeContent[0]

  const searchHierarchy = (children, depth = 0) => {
    if (depth > MAX_SEARCH_DEPTH) return null
    for (const child of children) {
      if (
        child.__typename === targetType ||
        child.title === targetType ||
        child.title?.includes(targetType.replace(/([A-Z])/g, " $1").trim())
      ) {
        return child
      }
      if (child.children?.length > 0) {
        const found = searchHierarchy(child.children, depth + 1)
        if (found) return found
      }
    }
    return null
  }

  return searchHierarchy(welcome.children)
}

export const navigateToScreen = (localeContent, targetType) => {
  const welcome = localeContent[0]
  const characterOverview = welcome.children.find(
    (child) =>
      child.title === "Character Overview" ||
      child.__typename === "CharacterOverview",
  )

  const chooseCharacter = characterOverview.children[0]
  const introSearchAndCollect = chooseCharacter.children[0]
  const photographyScreen = introSearchAndCollect.children[0]
  const yourCollection = photographyScreen.children[0]

  if (targetType === "PerspectiveScreen") {
    return yourCollection.children.find(
      (child) =>
        child.title === "Perspective Screen" ||
        child.__typename === "PerspectiveScreen",
    )
  }

  if (targetType === "EndingScreen") {
    const perspectiveScreen = yourCollection.children.find(
      (child) =>
        child.title === "Perspective Screen" ||
        child.__typename === "PerspectiveScreen",
    )
    return perspectiveScreen.children.find(
      (child) =>
        child.title === "Ending Screen" || child.__typename === "EndingScreen",
    )
  }

  return null
}

export const transformScreenData = (
  screenData,
  fallbackTitle = "",
  fallbackDescription = "",
) => {
  return {
    id: screenData.id,
    title: screenData.heading || screenData.title || fallbackTitle,
    description: parseRichText(screenData.description) || fallbackDescription,
    backgroundImage: screenData.backgroundImage,
    locale: screenData.locale || "en",
  }
}

export const handleApiError = (error, context = "API request") => {
  let userMessage = "An unexpected error occurred"
  let errorCode = "UNKNOWN_ERROR"

  if (error.name === "NetworkError" || error.message.includes("fetch")) {
    userMessage =
      "Network connection failed. Please check your internet connection."
    errorCode = "NETWORK_ERROR"
  } else if (error.message.includes("404")) {
    userMessage =
      "Content not found. The requested information is not available."
    errorCode = "NOT_FOUND"
  } else if (error.message.includes("500")) {
    userMessage = "Server error. Please try again later."
    errorCode = "SERVER_ERROR"
  } else if (error.message.includes("timeout")) {
    userMessage = "Request timed out. Please try again."
    errorCode = "TIMEOUT"
  }

  return {
    message: userMessage,
    code: errorCode,
    originalError: error,
    context,
  }
}

export const processImageUrl = (imageData, baseUrl = "") => {
  const imageUrl = imageData.file

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl
  }

  if (baseUrl && imageUrl.startsWith("/")) {
    return baseUrl + imageUrl
  }

  return imageUrl
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const retryWithBackoff = async (
  fn,
  maxAttempts = 3,
  baseDelay = 1000,
) => {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts) {
        throw error
      }

      const delayTime = baseDelay * Math.pow(2, attempt - 1)
      await delay(delayTime)
    }
  }

  throw lastError
}
