import { API_BASE_URL } from "@/api/config"

const CMS_DEV_ORIGIN = import.meta.env?.DEV
  ? (() => {
      try {
        return new URL(API_BASE_URL).origin
      } catch {
        return null
      }
    })()
  : null

const normalizeCmsMediaUrl = (value) => {
  if (typeof value !== "string" || value.length === 0) {
    return null
  }

  if (!CMS_DEV_ORIGIN) {
    return value
  }

  return value.startsWith(CMS_DEV_ORIGIN)
    ? value.replace(CMS_DEV_ORIGIN, "")
    : value
}

export const getPersistedPersonalImages = (defaults, capturedImages = []) => {
  if (Array.isArray(capturedImages) && capturedImages.some(Boolean)) {
    return defaults.map((d, i) => capturedImages[i] || d)
  }
  return defaults
}

const getRenditionFile = (renditions = []) => {
  if (!Array.isArray(renditions)) {
    return null
  }

  const match = renditions.find((rendition) => {
    if (typeof rendition === "string" && rendition.length > 0) {
      return true
    }
    if (rendition && typeof rendition === "object") {
      return (
        typeof rendition.file === "string" || typeof rendition.url === "string"
      )
    }
    return false
  })

  if (!match) {
    return null
  }

  if (typeof match === "string") {
    return match
  }

  return match.file || match.url || null
}

const resolveGalleryImageSource = (item) => {
  if (!item || typeof item !== "object") {
    return null
  }

  const source =
    item.file ||
    item.url ||
    item.image?.url ||
    item.image?.file ||
    item.image ||
    getRenditionFile(item.renditions)

  return normalizeCmsMediaUrl(source)
}

export const buildGalleryImagePool = (galleryImages = []) => {
  const galleryImageUrls = Array.isArray(galleryImages)
    ? galleryImages.reduce((accumulator, item) => {
        const source = resolveGalleryImageSource(item)
        if (source) {
          accumulator.push({
            url: source,
            date: item.created_at,
            title: item.title,
          })
        }
        return accumulator
      }, [])
    : []

  return {
    gallery: galleryImageUrls,
    combined: galleryImageUrls,
    stats: {
      galleryCount: galleryImageUrls.length,
      totalCount: galleryImageUrls.length,
    },
  }
}
