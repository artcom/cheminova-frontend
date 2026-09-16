const isDevelopment = import.meta.env.DEV

export let API_BASE_URL = null

export const setConfig = (config) => {
  const baseUrl = config?.API_BASE_URL

  if (typeof baseUrl !== "string" || !baseUrl.trim()) {
    throw new Error(
      "Invalid configuration: API_BASE_URL is missing or not a string.",
    )
  }

  API_BASE_URL = baseUrl.trim().replace(/\/+$/, "")
}

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})
