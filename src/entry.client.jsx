import { setConfig } from "@/api/config"

async function loadConfig() {
  try {
    const configUrl = import.meta.env.DEV ? "/config.json" : "./config.json"
    const response = await fetch(configUrl)
    console.info(`fetching from ${configUrl}`)
    const config = await response.json()
    console.info("config loaded", config)
    setConfig(config)
  } catch (error) {
    console.error("Failed to load config.json", error)
  }
}

loadConfig().then(() => {
  import("./bootstrap")
})
