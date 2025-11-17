import { loadCharacterContext } from "@/utils/loaderHelpers"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

import {
  DEFAULT_DATE_TIME_LABELS,
  TIMELINE_INDICATOR_BASE_BOTTOM,
} from "./constants"
import {
  ChevronButton,
  ChevronWrapper,
  ExitButton,
  Page,
  TimelineContainer,
} from "./styles"
import { TimelineInfo } from "./TimelineInfo"
import {
  formatDateTime,
  getGroupBottom,
  getGroupOpacity,
  getImageTitle,
  getIndicatorRight,
  getIndicatorWidth,
  getMarkerColor,
  getMarkerWidth,
  getTimelineHeight,
} from "./timelineMath"
import { TimelineMiniMap } from "./TimelineMiniMap"
import { TimelineStack } from "./TimelineStack"
import { useTimelineData } from "./useTimelineData"

export default function FutureTimeline() {
  const { characterSlug } = useLoaderData()
  const [requestedIndex, setRequestedIndex] = useState(0)
  const navigate = useNavigate()

  const {
    locale,
    isLoading,
    isError,
    error,
    totalImages,
    currentIndex,
    currentImage,
    visibleCards,
    timelineGroups,
    timelineIndexMap,
    totalGroups,
  } = useTimelineData(requestedIndex)

  const currentTimelinePosition =
    totalGroups > 0 && currentIndex < timelineIndexMap.length
      ? timelineIndexMap[currentIndex]
      : null

  const currentGroupIndex = currentTimelinePosition?.groupIndex ?? 0

  const currentGroupLength =
    totalGroups > 0 && currentTimelinePosition
      ? timelineGroups[currentTimelinePosition.groupIndex]?.items.length || 0
      : 0

  const currentMarkerVisualIndex =
    totalGroups > 0 && currentTimelinePosition && currentGroupLength > 0
      ? Math.min(
          Math.max(currentTimelinePosition.itemIndex ?? 0, 0),
          currentGroupLength - 1,
        )
      : 0

  const indicatorWidth = getIndicatorWidth(currentMarkerVisualIndex)
  const indicatorRight = getIndicatorRight(currentMarkerVisualIndex)
  const indicatorBottom = TIMELINE_INDICATOR_BASE_BOTTOM
  const timelineHeight = getTimelineHeight(totalGroups)

  const { dateLabel, timeLabel } = currentImage
    ? formatDateTime(currentImage.created_at, locale)
    : DEFAULT_DATE_TIME_LABELS

  const infoTitle = currentImage
    ? getImageTitle(currentImage)
    : isError
      ? "Unable to load timeline"
      : isLoading
        ? "Loading timeline..."
        : "No timeline entries yet"

  const infoDescriptionLines = currentImage
    ? [dateLabel, timeLabel].filter(Boolean)
    : isError
      ? ["Please try again later."]
      : isLoading
        ? ["Fetching future memories..."]
        : ["Check back soon for new discoveries."]

  const handleNext = () => {
    setRequestedIndex((previous) => {
      if (totalImages === 0) {
        return 0
      }

      if (previous >= totalImages - 1) {
        return previous
      }

      return previous + 1
    })
  }

  const handleGoToEnding = () => {
    if (!characterSlug) {
      return
    }

    navigate(`/characters/${characterSlug}/ending`)
  }

  const showLoadingOverlay = isLoading && totalImages === 0
  const showErrorOverlay = isError && totalImages === 0
  const showEmptyOverlay = !isLoading && !isError && totalImages === 0
  const nextDisabled = totalImages === 0 || currentIndex >= totalImages - 1

  return (
    <Page>
      <ExitButton type="button" onClick={handleGoToEnding}>
        Go to ending
      </ExitButton>

      <TimelineContainer>
        <TimelineStack
          visibleCards={visibleCards}
          showLoadingOverlay={showLoadingOverlay}
          showErrorOverlay={showErrorOverlay}
          showEmptyOverlay={showEmptyOverlay}
          error={error}
        />

        <TimelineInfo
          title={infoTitle}
          descriptionLines={infoDescriptionLines}
        />

        <TimelineMiniMap
          timelineGroups={timelineGroups}
          timelineHeight={timelineHeight}
          currentIndex={currentIndex}
          currentGroupIndex={currentGroupIndex}
          locale={locale}
          formatDateTime={formatDateTime}
          getGroupBottom={getGroupBottom}
          getGroupOpacity={getGroupOpacity}
          getMarkerWidth={getMarkerWidth}
          getMarkerColor={getMarkerColor}
          indicatorBottom={indicatorBottom}
          indicatorRight={indicatorRight}
          indicatorWidth={indicatorWidth}
        />
      </TimelineContainer>

      <ChevronWrapper>
        <ChevronButton
          onClick={handleNext}
          whileHover={nextDisabled ? undefined : { scale: 1.1 }}
          whileTap={nextDisabled ? undefined : { scale: 0.95 }}
          disabled={nextDisabled}
        >
          <svg viewBox="0 0 22 12">
            <polyline points="1,1 11,11 21,1" />
          </svg>
        </ChevronButton>
      </ChevronWrapper>
    </Page>
  )
}

export async function clientLoader({ params }) {
  const { characterSlug, characterIndex } = await loadCharacterContext(params)
  return { characterIndex, characterSlug }
}
