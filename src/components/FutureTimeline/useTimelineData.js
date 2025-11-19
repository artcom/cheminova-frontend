import { getCurrentLocale } from "@/i18n"
import { useMemo } from "react"

import { buildTimelineMeta, computeTimelineImages } from "./timelineMath"
import { useFutureTimelineImages } from "./useFutureTimelineImages"

export function useTimelineData(requestedIndex) {
  const locale = getCurrentLocale()
  const {
    data: futureImages = [],
    isLoading,
    isError,
    error,
  } = useFutureTimelineImages()

  const timelineState = useMemo(() => {
    const timelineImages = computeTimelineImages(futureImages)

    return {
      timelineImages,
      ...buildTimelineMeta(timelineImages, requestedIndex),
    }
  }, [futureImages, requestedIndex])

  return {
    locale,
    isLoading,
    isError,
    error,
    futureImages,
    ...timelineState,
  }
}
