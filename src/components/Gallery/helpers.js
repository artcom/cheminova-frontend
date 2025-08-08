// Small helpers to keep Gallery.jsx focused

export function getPersistedPersonalImages(defaults) {
  try {
    const stored = JSON.parse(localStorage.getItem("personalImages") || "[]")
    if (Array.isArray(stored) && stored.some(Boolean)) {
      // Keep only valid URLs, fill missing with defaults
      return defaults.map((d, i) => stored[i] || d)
    }
  } catch {
    // ignore
  }
  return defaults
}

export function buildImagePoolFromGlob(globObj) {
  const entries = Object.entries(globObj)
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([, url]) => url)
}
