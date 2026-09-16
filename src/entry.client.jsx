import { setConfig } from "@/api/config"

// Resolved against the configured base (VITE_BASE_PATH), so it stays absolute
// on nested routes. A relative "./config.json" would resolve to
// "/page/config.json" on a deep route and hit the SPA fallback instead.
const CONFIG_URL = `${import.meta.env.BASE_URL}config.json`

async function loadConfig() {
  const response = await fetch(CONFIG_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${CONFIG_URL}. HTTP error! status: ${response.status}`,
    )
  }

  const contentType = response.headers.get("content-type") || ""

  if (!contentType.toLowerCase().includes("application/json")) {
    const preview = await response.text()
    const snippet = preview.slice(0, 120)
    throw new Error(
      `Unexpected response format from ${CONFIG_URL}. Expected JSON but received ${contentType || "unknown"}. Preview: ${snippet}`,
    )
  }

  const config = await response.json()
  console.info("config loaded", config)
  setConfig(config)
}

function renderConfigError(error) {
  const container = document.createElement("div")
  container.setAttribute("role", "alert")
  container.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "align-items:center",
    "justify-content:center",
    "gap:12px",
    "box-sizing:border-box",
    "width:100vw",
    "height:100vh",
    "margin:0",
    "padding:24px",
    "background-color:#0b0b0b",
    "color:#f5f5f5",
    "font-family:Arial, sans-serif",
    "text-align:center",
  ].join(";")

  const heading = document.createElement("h1")
  heading.style.cssText = "margin:0;font-size:20px;font-weight:600"
  heading.textContent = "Configuration could not be loaded"

  const detail = document.createElement("p")
  detail.style.cssText = "margin:0;font-size:14px;max-width:60ch"
  detail.textContent = `The application could not read ${CONFIG_URL}. It must be a JSON file containing an "API_BASE_URL" entry.`

  const reason = document.createElement("pre")
  reason.style.cssText =
    "margin:0;font-size:12px;max-width:80ch;white-space:pre-wrap;word-break:break-word;opacity:0.7"
  reason.textContent = error?.message || String(error)

  container.append(heading, detail, reason)
  document.body.replaceChildren(container)
}

loadConfig().then(
  () => import("./bootstrap"),
  (error) => {
    console.error(`Failed to load ${CONFIG_URL}`, error)
    renderConfigError(error)
  },
)
