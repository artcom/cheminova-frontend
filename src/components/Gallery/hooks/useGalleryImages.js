import { API_BASE_URL } from "@/api/config"
import { useQuery } from "@tanstack/react-query"

export const useGalleryImages = (options = {}) => {
  const { enabled = true } = options

  return useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/gallery/all-images/`)

      if (!response.ok) {
        throw new Error(`Failed to fetch gallery images: ${response.status}`)
      }

      return response.json()
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}
