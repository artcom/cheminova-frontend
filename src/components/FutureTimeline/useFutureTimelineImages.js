import { API_BASE_URL } from "@/api/config"
import { useQuery } from "@tanstack/react-query"

const FUTURE_TIMELINE_IMAGES_QUERY_KEY = ["future-timeline", "images"]

const normalizeFutureTimelineImages = (data) => {
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
        return timestampB - timestampA
      }

      if (!Number.isNaN(timestampA)) return -1
      if (!Number.isNaN(timestampB)) return 1

      if (typeof a.id === "number" && typeof b.id === "number") {
        return b.id - a.id
      }

      return String(a.title ?? "").localeCompare(String(b.title ?? ""))
    })
}

export const useFutureTimelineImages = (options = {}) => {
  const { enabled = true, select, ...queryOptions } = options

  return useQuery({
    queryKey: FUTURE_TIMELINE_IMAGES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/images/future`)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch future timeline images: ${response.status}`,
        )
      }

      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => {
      const normalized = normalizeFutureTimelineImages(data)
      return typeof select === "function" ? select(normalized) : normalized
    },
    ...queryOptions,
  })
}

export { normalizeFutureTimelineImages }
