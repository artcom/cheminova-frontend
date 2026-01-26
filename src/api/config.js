const isDevelopment = import.meta.env.DEV

export const API_BASE_URL =
  (typeof window !== "undefined" ? window.APP_CONFIG?.API_BASE_URL : null) ||
  (isDevelopment ? "http://localhost:8080/api" : "/cms/api")

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})
