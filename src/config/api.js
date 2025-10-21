const isDevelopment = import.meta.env.DEV

export const API_BASE_URL = isDevelopment ? "/api" : "/cms/api"

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})

if (isDevelopment) {
  console.log("🔧 API Config:", {
    baseUrl: API_BASE_URL,
    environment: "development",
    note: "Django backend should be serving at http://localhost:8080/api/all",
  })
}
