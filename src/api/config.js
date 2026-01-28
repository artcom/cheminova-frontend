const isDevelopment = import.meta.env.DEV

export let API_BASE_URL = null

export const setConfig = (config) => {
  if (config.API_BASE_URL) {
    API_BASE_URL = config.API_BASE_URL
  }
}

export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDevelopment,
})
