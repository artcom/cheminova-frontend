import { API_BASE_URL } from "@/api/config"
import { useQuery } from "@tanstack/react-query"

const JANITOR_LOGBOOK_IMAGES_QUERY_KEY = ["janitor-logbook", "images"]

const normalizeJanitorLogbookImages = (data) => {
  if (!Array.isArray(data)) {
    return []
  }

  return data
    .filter((item) => item && typeof item === "object" && item.file)
    .map((item) => ({
      ...item,
      renditions: Array.isArray(item.renditions) ? item.renditions : [],
    }))
    .sort((a, b) => {
      const timestampA = Date.parse(a.created_at ?? "")
      const timestampB = Date.parse(b.created_at ?? "")

      if (!Number.isNaN(timestampA) && !Number.isNaN(timestampB)) {
        // Sort by newest first for the logbook stack?
        // The mock data seemed to be chronological, but a stack usually shows newest on top or oldest?
        // Let's assume chronological for now as per the mock data dates (March 22, 23, 24).
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

export const useJanitorLogbookImages = (options = {}) => {
  const { enabled = true, select, ...queryOptions } = options

  return useQuery({
    queryKey: JANITOR_LOGBOOK_IMAGES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/images/janitor`)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch janitor logbook images: ${response.status}`,
        )
      }

      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => {
      const normalized = normalizeJanitorLogbookImages(data)
      return typeof select === "function" ? select(normalized) : normalized
    },
    ...queryOptions,
  })
}

export { normalizeJanitorLogbookImages }
