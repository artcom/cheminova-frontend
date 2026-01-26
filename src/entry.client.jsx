async function loadConfig() {
  try {
    const response = await fetch("./config.json")
    console.info("fetching from ./config.json")
    const config = await response.json()
    console.info("config loaded", config)
    window.APP_CONFIG = config
  } catch (error) {
    console.error("Failed to load config.json", error)
  }
}

loadConfig().then(() => {
  import("./bootstrap")
})
