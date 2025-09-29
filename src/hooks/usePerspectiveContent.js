import {
  handleApiError,
  navigateToScreen,
  transformScreenData,
} from "@/utils/apiUtils"

import { useLocalizedQuery } from "./useLocalizedQuery"

const usePerspectiveContent = () => {
  return useLocalizedQuery({
    queryKey: ["perspective-content"],
    queryFn: (localeContent) => {
      try {
        const perspectiveScreen = navigateToScreen(
          localeContent,
          "PerspectiveScreen",
        )

        return transformScreenData(
          perspectiveScreen,
          "Your Perspective", // fallback title
          "You've seen the monument through new eyes. Now, add your vision to a living collage, together with others who care, just like you.", // fallback description
        )
      } catch (error) {
        const errorDetails = handleApiError(
          error,
          "Perspective content loading",
        )
        throw new Error(errorDetails.message)
      }
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export default usePerspectiveContent
