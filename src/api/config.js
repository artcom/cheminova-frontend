const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment
  ? "http://localhost:8080/api"
  : "/cms/api"

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})
