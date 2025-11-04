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
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error)
    throw error
  }
}

export const ALL_LOCALES_CONTENT_QUERY_KEY = ["all-locales-content"]

export const fetchAllLocalesContent = async () => {
  try {
    const data = await apiRequest("/all/")
    return data
  } catch (error) {
    console.error("❌ Failed to fetch all locales content:", error)
    throw error
  }
}

export const fetchCharacterSlugs = async (locale) => {
  const params = new URLSearchParams({ browsable: "false" })
  if (locale) {
    params.set("locale", locale)
  }

  const query = params.toString()
  const endpoint = `/characters/${query ? `?${query}` : ""}`
  return apiRequest(endpoint)
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
    return [localeContent]
  }

  console.warn(
    `⚠️ No content found for locale: ${locale}, falling back to first available`,
  )
  return [allLocalesContent[0]]
}

export const fetchApiRoot = async () => {
  const data = await apiRequest("/")
  return data
}

export const fetchAll = async (locale) => {
  const allLocalesContent = await fetchAllLocalesContent()
  return getContentForLocale(allLocalesContent, locale)
}
