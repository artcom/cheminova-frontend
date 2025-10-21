import { API_BASE_URL } from "@/config/api"

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

export const ALL_LOCALES_CONTENT_QUERY_KEY = ["all-locales-content"]

export const fetchAllLocalesContent = async () => {
  console.log("🌍 Fetching content for all locales...")
  try {
    const data = await apiRequest("/all/")

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

export const getContentForLocale = (allLocalesContent, locale = "en") => {
  if (!Array.isArray(allLocalesContent) || allLocalesContent.length === 0) {
    console.warn("⚠️ No localized content available yet, returning null")
    return null
  }

  const localeContent = allLocalesContent.find(
    (item) => item?.locale === locale,
  )

  if (localeContent) {
    console.log(`📋 Retrieved ${locale} content`)
    return [localeContent]
  }

  console.warn(
    `⚠️ No content found for locale: ${locale}, falling back to first available`,
  )
  return [allLocalesContent[0]]
}

export const fetchApiRoot = async () => {
  console.log("🔌 Fetching from Django API root...")
  const data = await apiRequest("/")
  return data
}

export const fetchAll = async (locale) => {
  const allLocalesContent = await fetchAllLocalesContent()
  return getContentForLocale(allLocalesContent, locale)
}
