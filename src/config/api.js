const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment
  ? "http://localhost:8080/api" // Direct to Django backend (bypasses Vite proxy)
  : "/cms/api" // Production: relative path

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})

if (isDevelopment) {
  console.log("🔧 API Config:", {
    baseUrl: API_BASE_URL,
    environment: "development",
    note: "Direct connection to Django backend at localhost:8080",
  })
}
