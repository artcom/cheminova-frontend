const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/cms/api"

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log(`🌐 API Request: ${url}`)
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ API Response from ${endpoint}:`, data)
    return data
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error)
    throw error
  }
}

let allLocalesContent = null

export const fetchAllLocalesContent = async () => {
  console.log("🌍 Fetching content for all locales...")
  try {
    const data = await apiRequest("/api/all/")
    allLocalesContent = data

    console.log(
      "✅ Content loaded for locales:",
      Array.isArray(data) ? data.map((item) => item.locale) : [],
    )
    return data
  } catch (error) {
    console.error("❌ Failed to fetch all locales content:", error)
    throw error
  }
}

export const getContentForLocale = (locale = "en") => {
  if (!allLocalesContent) {
    console.warn("⚠️ Content not loaded yet, returning null")
    return null
  }

  if (Array.isArray(allLocalesContent)) {
    const localeContent = allLocalesContent.find(
      (item) => item.locale === locale,
    )
    if (localeContent) {
      console.log(`📋 Retrieved ${locale} content`)
      return [localeContent]
    }
  }

  console.warn(
    `⚠️ No content found for locale: ${locale}, falling back to first available`,
  )
  return Array.isArray(allLocalesContent)
    ? [allLocalesContent[0]]
    : allLocalesContent
}

export const fetchApiRoot = async () => {
  console.log("🔌 Fetching from Django API root...")
  const data = await apiRequest("/api/")
  return data
}

export const fetchAll = async (locale) => {
  if (!allLocalesContent) {
    await fetchAllLocalesContent()
  }
  return getContentForLocale(locale)
}
