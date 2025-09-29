import { useQuery } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/cms/api"

export const useGalleryImages = (options = {}) => {
  const { enabled = true } = options

  return useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/gallery/all-images/`)

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
