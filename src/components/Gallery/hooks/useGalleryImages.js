import { API_BASE_URL } from "@/api/config"
import { useQuery } from "@tanstack/react-query"

const GALLERY_IMAGES_QUERY_KEY = ["gallery-images"]

const normalizeGalleryImages = (data) => {
  if (!Array.isArray(data)) {
    return []
  }

  return data
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const renditions = Array.isArray(item.renditions) ? item.renditions : []
      const directFile =
        item.file ||
        item.url ||
        item.image?.url ||
        item.image?.file ||
        item.image ||
        renditions.find((rendition) => rendition?.file)?.file

      if (!directFile) {
        return null
      }

      return {
        ...item,
        file: directFile,
        renditions,
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      const timestampA = Date.parse(a.created_at ?? "")
      const timestampB = Date.parse(b.created_at ?? "")

      if (!Number.isNaN(timestampA) && !Number.isNaN(timestampB)) {
        return timestampA - timestampB
      }

      if (!Number.isNaN(timestampA)) return -1
      if (!Number.isNaN(timestampB)) return 1

      if (typeof a.id === "number" && typeof b.id === "number") {
        return a.id - b.id
      }

      return String(a.title ?? "").localeCompare(String(b.title ?? ""))
    })
}

export const useGalleryImages = (options = {}) => {
  const { enabled = true, select, ...queryOptions } = options

  return useQuery({
    queryKey: GALLERY_IMAGES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/images/artist`)

      if (!response.ok) {
        throw new Error(`Failed to fetch gallery images: ${response.status}`)
      }

      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => {
      const normalized = normalizeGalleryImages(data)
      return typeof select === "function" ? select(normalized) : normalized
    },
    ...queryOptions,
  })
}

export { normalizeGalleryImages }
