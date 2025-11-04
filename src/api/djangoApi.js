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

  const response = await fetch(url, defaultOptions)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const ALL_LOCALES_CONTENT_QUERY_KEY = ["all-locales-content"]

export const fetchAllLocalesContent = async () => {
  return apiRequest("/all/")
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
  const localeContent = allLocalesContent.find((item) => item.locale === locale)
  return localeContent ? [localeContent] : [allLocalesContent[0]]
}

export const fetchApiRoot = async () => {
  return apiRequest("/")
}

export const fetchAll = async (locale) => {
  const allLocalesContent = await fetchAllLocalesContent()
  return getContentForLocale(allLocalesContent, locale)
}
