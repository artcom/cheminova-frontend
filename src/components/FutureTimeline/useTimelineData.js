import { getCurrentLocale } from "@/i18n"
import { useMemo } from "react"

import { buildTimelineMeta, computeTimelineImages } from "./timelineMath"
import { useFutureTimelineImages } from "./useFutureTimelineImages"

export function useTimelineData(requestedIndex, newEntry) {
  const locale = getCurrentLocale()
  const {
    data: fetchedImages = [],
    isLoading,
    isError,
    error,
  } = useFutureTimelineImages()

  const futureImages = useMemo(() => {
    if (newEntry) {
      return [newEntry, ...fetchedImages]
    }
    return fetchedImages
  }, [fetchedImages, newEntry])

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
