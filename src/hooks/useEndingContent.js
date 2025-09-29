import {
  handleApiError,
  navigateToScreen,
  transformScreenData,
} from "@/utils/apiUtils"

import { useLocalizedQuery } from "./useLocalizedQuery"

const useEndingContent = () => {
  return useLocalizedQuery({
    queryKey: ["ending-content"],
    queryFn: (localeContent) => {
      try {
        const endingScreen = navigateToScreen(localeContent, "EndingScreen")

        return transformScreenData(
          endingScreen,
          "Thank You",
          "Thank you for contributing to this monument and keeping it alive. Now take a further look around La Nau.",
        )
      } catch (error) {
        const errorDetails = handleApiError(error, "Ending content loading")
        throw new Error(errorDetails.message)
      }
    },
    enabled: true,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export default useEndingContent
