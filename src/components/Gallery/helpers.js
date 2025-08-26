export const getPersistedPersonalImages = (defaults) => {
  const stored = JSON.parse(localStorage.getItem("personalImages") || "[]")
  if (Array.isArray(stored) && stored.some(Boolean)) {
    return defaults.map((d, i) => stored[i] || d)
  }
  return defaults
}

export const buildImagePoolFromGlob = (globObj) => {
  const entries = Object.entries(globObj)
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([, url]) => url)
}
