// The CMS is configured with its own absolute base URL, so the media links it
// returns are absolute too (http://localhost:8080/media/... in dev). That host
// is only reachable from the machine running the CMS -- on a phone "localhost"
// is the phone -- and going there directly also skips the dev server proxy, so
// the request gets blocked by CORS. Rewrite those links to paths the proxy
// forwards, which keeps them same-origin whichever host the page is served on.
//
// Development only: in production the CMS base URL is the one the browser
// should actually use, and media may well live on another origin.
const IS_DEV = Boolean(import.meta.env?.DEV)

// Kept in sync with the proxied prefixes in vite.config.js.
const PROXIED_PREFIXES = ["/media/", "/original_images/", "/static/", "/cms/"]

// Matches absolute URLs both on their own and embedded in rich text markup.
const ABSOLUTE_URL = /https?:\/\/[^\s"'<>]+/g

const toProxyPath = (candidate, pageOrigin) => {
  let url

  try {
    url = new URL(candidate)
  } catch {
    return candidate
  }

  if (url.origin === pageOrigin) {
    return candidate
  }

  return PROXIED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
    ? `${url.pathname}${url.search}${url.hash}`
    : candidate
}

export const normalizeCmsUrls = (value) => {
  if (!IS_DEV || typeof window === "undefined") {
    return value
  }

  const pageOrigin = window.location.origin

  const walk = (node) => {
    if (typeof node === "string") {
      return node.replace(ABSOLUTE_URL, (match) =>
        toProxyPath(match, pageOrigin),
      )
    }

    if (Array.isArray(node)) {
      return node.map(walk)
    }

    if (node && typeof node === "object") {
      return Object.fromEntries(
        Object.entries(node).map(([key, entry]) => [key, walk(entry)]),
      )
    }

    return node
  }

  return walk(value)
}
