export const parseRichText = (richText) => {
  if (!richText) return null
  if (typeof richText === "string") {
    return richText
  }
  if (richText.text) {
    return richText.text
  }
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
  if (!localeContent || !Array.isArray(localeContent)) {
    return null
  }

  const welcome = localeContent[0]
  if (!welcome || !welcome.children) {
    return null
  }

  const searchHierarchy = (children, depth = 0) => {
    if (!children || depth > 10) return null
    for (const child of children) {
      if (
        child.__typename === targetType ||
        child.title === targetType ||
        child.title?.includes(targetType.replace(/([A-Z])/g, " $1").trim())
      ) {
        return child
      }
      if (child.children && child.children.length > 0) {
        const found = searchHierarchy(child.children, depth + 1)
        if (found) return found
      }
    }
    return null
  }

  return searchHierarchy(welcome.children)
}

export const navigateToScreen = (localeContent, targetType) => {
  if (!localeContent || !Array.isArray(localeContent)) {
    return null
  }

  try {
    const welcome = localeContent[0]
    if (!welcome || !welcome.children) {
      return null
    }

    const characterOverview = welcome.children.find(
      (child) =>
        child.title === "Character Overview" ||
        child.__typename === "CharacterOverview",
    )

    if (!characterOverview || !characterOverview.children) {
      return null
    }

    const chooseCharacter = characterOverview.children[0]
    if (!chooseCharacter || !chooseCharacter.children) {
      return null
    }

    const introSearchAndCollect = chooseCharacter.children[0]
    if (!introSearchAndCollect || !introSearchAndCollect.children) {
      return null
    }

    const photographyScreen = introSearchAndCollect.children[0]
    if (!photographyScreen || !photographyScreen.children) {
      return null
    }

    const yourCollection = photographyScreen.children[0]
    if (!yourCollection || !yourCollection.children) {
      return null
    }

    if (targetType === "PerspectiveScreen") {
      const perspectiveScreen = yourCollection.children.find(
        (child) =>
          child.title === "Perspective Screen" ||
          child.__typename === "PerspectiveScreen",
      )
      return perspectiveScreen
    }

    if (targetType === "EndingScreen") {
      const perspectiveScreen = yourCollection.children.find(
        (child) =>
          child.title === "Perspective Screen" ||
          child.__typename === "PerspectiveScreen",
      )

      if (!perspectiveScreen || !perspectiveScreen.children) {
        return null
      }

      const endingScreen = perspectiveScreen.children.find(
        (child) =>
          child.title === "Ending Screen" ||
          child.__typename === "EndingScreen",
      )
      return endingScreen
    }

    return null
  } catch (error) {
    console.warn(`Error navigating to ${targetType}:`, error)
    return null
  }
}

export const transformScreenData = (
  screenData,
  fallbackTitle = "",
  fallbackDescription = "",
) => {
  if (!screenData) {
    return {
      id: null,
      title: fallbackTitle,
      description: fallbackDescription,
      backgroundImage: null,
      locale: "en",
    }
  }

  return {
    id: screenData.id,
    title: screenData.heading || screenData.title || fallbackTitle,
    description: parseRichText(screenData.description) || fallbackDescription,
    backgroundImage: screenData.backgroundImage,
    locale: screenData.locale || "en",
  }
}

export const handleApiError = (error, context = "API request") => {
  console.error(`❌ ${context} failed:`, error)

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
  if (!imageData || !imageData.file) {
    return null
  }

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
      console.log(`Attempt ${attempt} failed, retrying in ${delayTime}ms...`)
      await delay(delayTime)
    }
  }

  throw lastError
}
