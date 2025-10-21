const isDevelopment = import.meta.env.DEV

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isDevelopment ? "http://localhost:8080" : "/cms/api")

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})

if (isDevelopment) {
  console.log("🔧 API Config:", {
    baseUrl: API_BASE_URL,
    environment: "development",
  })
}
