import LoadingSpinner from "@/components/UI/LoadingSpinner"
import { useFutureTimelineImages } from "@/hooks/useFutureTimelineImages"
import { getCurrentLocale } from "@/i18n"
import { loadCharacterContext } from "@/utils/loaderHelpers"
import theme from "@theme"
import { LayoutGroup, motion } from "motion/react"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import { styled } from "styled-components"

const Page = styled.div`
  background-color: ${theme.colors.background.dark};
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`

const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

const ImageStack = styled.div`
  position: relative;
  width: 270px;
  height: 270px;
  margin: 130px 0 60px 60px;
`

const ImageCard = styled(motion.div)`
  position: absolute;
  width: 270px;
  height: 270px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0px 0px 22px 0px rgba(0, 0, 0, 0.58);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const StackOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.55);
  z-index: 6;
  text-align: center;
`

const OverlayMessage = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 16px;
  line-height: 1.4;
`

const InfoSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  color: white;
  margin: auto 0 5rem 20px;
  padding-right: 20px;
`

const InfoContent = styled.div`
  width: 250px;
`

const InfoDivider = styled.div`
  align-self: stretch;
  border-top: 1px dotted rgba(255, 255, 255, 0.35);
  width: calc(100vw - 60px);
`

const Title = styled.h1`
  font-family: "Bricolage Grotesque", sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: normal;
`

const DateTime = styled.div`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;

  p {
    margin: 0;
  }
`

const TIMELINE_WIDTH = 160
const TIMELINE_LINE_RIGHT = 0
const TIMELINE_GROUP_END_RIGHT = 5
const TIMELINE_MARKER_HEIGHT = 18
const TIMELINE_MARKER_GAP = 1
const TIMELINE_MARKER_BASE_WIDTH = 1
const TIMELINE_MARKER_WIDTH_STEP = 0.5
const TIMELINE_MARKER_MAX_WIDTH = 5.5
const TIMELINE_MARKER_SLOT_WIDTH = TIMELINE_MARKER_MAX_WIDTH
const TIMELINE_TICK_COLOR_PALETTE = [
  "rgb(249, 249, 249)",
  "rgb(214, 214, 214)",
  "rgb(178, 178, 178)",
  "rgb(142, 142, 142)",
  "rgb(106, 106, 106)",
]
const TIMELINE_VERTICAL_PADDING = 12
const TIMELINE_INDICATOR_EXTRA = 4
const TIMELINE_ROW_GAP = 6
const TIMELINE_ROW_STEP = TIMELINE_MARKER_HEIGHT + TIMELINE_ROW_GAP
const TIMELINE_MIN_HEIGHT = 160
const TIMELINE_GROUP_BASE_BOTTOM =
  TIMELINE_VERTICAL_PADDING - TIMELINE_MARKER_HEIGHT / 2
const TIMELINE_INDICATOR_BASE_BOTTOM =
  TIMELINE_VERTICAL_PADDING -
  (TIMELINE_MARKER_HEIGHT + TIMELINE_INDICATOR_EXTRA) / 2

const Timeline = styled.div`
  position: fixed;
  right: 5px;
  bottom: 5rem;
  width: ${TIMELINE_WIDTH}px;
  pointer-events: none;
  --timeline-height: 320px;
  height: var(--timeline-height);

  &::before {
    content: "";
    position: absolute;
    top: ${TIMELINE_VERTICAL_PADDING}px;
    bottom: ${TIMELINE_VERTICAL_PADDING}px;
    right: ${TIMELINE_LINE_RIGHT}px;
    width: 2px;
    background: linear-gradient(
      to top,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
  }
`

const TimelineDot = styled(motion.div)`
  position: absolute;
  height: ${TIMELINE_MARKER_HEIGHT + TIMELINE_INDICATOR_EXTRA}px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.65);
  border-radius: 0;
  z-index: 2;
`

const TimelineTick = styled.div`
  width: ${({ $width }) => `${$width}px`};
  height: ${TIMELINE_MARKER_HEIGHT}px;
  background: ${({ $color }) => $color};
  opacity: ${({ $opacity }) => $opacity};
  flex: 0 0 auto;
  box-shadow: ${({ $isCurrent }) =>
    $isCurrent ? "0 0 6px rgba(255, 255, 255, 0.55)" : "none"};
  border-radius: 0;
  transition:
    width 0.3s ease,
    opacity 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
`

const TimelineGroup = styled(motion.div)`
  position: absolute;
  display: flex;
  gap: ${TIMELINE_MARKER_GAP}px;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: flex-start;
  right: ${TIMELINE_GROUP_END_RIGHT}px;
  z-index: 1;
  min-height: ${TIMELINE_MARKER_HEIGHT}px;
`

const TimelineTickSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 ${TIMELINE_MARKER_SLOT_WIDTH}px;
  width: ${TIMELINE_MARKER_SLOT_WIDTH}px;
  height: ${TIMELINE_MARKER_HEIGHT}px;
`

const ChevronWrapper = styled.div`
  position: fixed;
  bottom: 12rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChevronButton = styled(motion.button)`
  width: 44px;
  height: 44px;
  border: 2px solid white;
  border-radius: 30px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 22px;
    height: 12px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }
`

const ExitButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`
const DEFAULT_DATE_TIME_LABELS = {
  dateLabel: "Date unknown",
  timeLabel: "",
}

const formatDateTime = (value, locale) => {
  if (!value) {
    return DEFAULT_DATE_TIME_LABELS
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return DEFAULT_DATE_TIME_LABELS
  }

  try {
    const dateLabel = new Intl.DateTimeFormat(locale || undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)

    const timeLabel = new Intl.DateTimeFormat(locale || undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)

    return {
      dateLabel,
      timeLabel,
    }
  } catch (error) {
    console.error("Failed to format date for future timeline", error)
    return DEFAULT_DATE_TIME_LABELS
  }
}

const getImageTitle = (image) => {
  if (!image) {
    return ""
  }

  const titleSources = [
    image.title,
    image.uploaded_text,
    image.uploaded_user_name,
  ]

  for (const value of titleSources) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }
  }

  return "Untitled memory"
}

const getDayKey = (value) => {
  if (!value) {
    return "unknown"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "unknown"
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const MAX_TIMELINE_IMAGES_PER_DAY = 12

const limitImagesPerDay = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return Array.isArray(images) ? images : []
  }

  const indicesByDay = new Map()

  images.forEach((image, index) => {
    if (!image) {
      return
    }

    const dayKey = getDayKey(image.created_at)
    if (!indicesByDay.has(dayKey)) {
      indicesByDay.set(dayKey, [])
    }

    indicesByDay.get(dayKey).push(index)
  })

  const hasOverflowingDay = Array.from(indicesByDay.values()).some(
    (indices) => indices.length > MAX_TIMELINE_IMAGES_PER_DAY,
  )

  if (!hasOverflowingDay) {
    return images
  }

  const allowedIndices = new Set()

  indicesByDay.forEach((indices, dayKey) => {
    if (indices.length <= MAX_TIMELINE_IMAGES_PER_DAY) {
      indices.forEach((index) => allowedIndices.add(index))
      return
    }

    const randomizedSelection = indices
      .slice()
      .sort((indexA, indexB) => {
        const imageA = images[indexA]
        const imageB = images[indexB]

        const weightA = hashString(
          `${dayKey}-${imageA?.id ?? imageA?.file ?? indexA}`,
        )
        const weightB = hashString(
          `${dayKey}-${imageB?.id ?? imageB?.file ?? indexB}`,
        )

        return weightA - weightB
      })
      .slice(0, MAX_TIMELINE_IMAGES_PER_DAY)

    randomizedSelection.forEach((index) => allowedIndices.add(index))
  })

  return images.filter((_, index) => allowedIndices.has(index))
}

const groupImagesByDay = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return { groups: [], indexMap: [] }
  }

  const groups = []
  const indexMap = []

  images.forEach((image, index) => {
    if (!image) {
      return
    }

    const dayKey = getDayKey(image.created_at)
    let group = groups[groups.length - 1]

    if (!group || group.dateKey !== dayKey) {
      group = {
        dateKey: dayKey,
        items: [],
      }
      groups.push(group)
    }

    const itemIndex = group.items.length
    group.items.push({ image, globalIndex: index })
    indexMap[index] = { groupIndex: groups.length - 1, itemIndex }
  })

  return { groups, indexMap }
}

const hashString = (value) => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    const char = value.charCodeAt(index)
    hash = (hash << 5) - hash + char
    hash |= 0
  }

  return Math.abs(hash)
}

const getMarkerWidth = (itemIndex = 0) => {
  const safeIndex = Math.max(itemIndex, 0)
  const rawWidth =
    TIMELINE_MARKER_BASE_WIDTH + TIMELINE_MARKER_WIDTH_STEP * safeIndex

  return Math.min(rawWidth, TIMELINE_MARKER_MAX_WIDTH)
}

const getMarkerCenterRight = (itemIndex = 0) => {
  const safeIndex = Math.max(itemIndex, 0)
  const slotRightEdge =
    TIMELINE_GROUP_END_RIGHT +
    safeIndex * (TIMELINE_MARKER_SLOT_WIDTH + TIMELINE_MARKER_GAP)

  return slotRightEdge + getMarkerWidth(safeIndex) / 2
}

const getMarkerColor = (image, fallbackSeed) => {
  if (TIMELINE_TICK_COLOR_PALETTE.length === 0) {
    return "rgb(220, 220, 220)"
  }

  const seedSource =
    image?.id ?? image?.file ?? image?.uploaded_text ?? fallbackSeed
  const paletteIndex =
    hashString(String(seedSource ?? fallbackSeed ?? 0)) %
    TIMELINE_TICK_COLOR_PALETTE.length

  return TIMELINE_TICK_COLOR_PALETTE[paletteIndex]
}

const STACK_LAYERS = [
  {
    indexOffset: 4,
    style: {
      left: "-144px",
      top: "-144px",
      opacity: 0.45,
      zIndex: 1,
    },
  },
  {
    indexOffset: 3,
    style: {
      left: "-108px",
      top: "-108px",
      opacity: 0.58,
      zIndex: 2,
    },
  },
  {
    indexOffset: 2,
    style: {
      left: "-72px",
      top: "-72px",
      opacity: 0.72,
      zIndex: 3,
    },
  },
  {
    indexOffset: 1,
    style: {
      left: "-36px",
      top: "-36px",
      opacity: 0.88,
      zIndex: 4,
    },
  },
]

const CARD_LAYERS = [
  {
    indexOffset: 0,
    style: {
      left: "0px",
      top: "0px",
      opacity: 1,
      zIndex: 5,
    },
  },
  ...STACK_LAYERS,
]

export default function FutureTimeline() {
  const { characterSlug } = useLoaderData()
  const [requestedIndex, setRequestedIndex] = useState(0)
  const navigate = useNavigate()

  const locale = getCurrentLocale()
  const {
    data: futureImages = [],
    isLoading,
    isError,
    error,
  } = useFutureTimelineImages()

  const timelineImagesSorted = futureImages.slice().sort((a, b) => {
    const timeA = Date.parse(a?.created_at ?? "")
    const timeB = Date.parse(b?.created_at ?? "")

    if (!Number.isNaN(timeA) && !Number.isNaN(timeB)) {
      return timeA - timeB
    }

    if (!Number.isNaN(timeA)) return -1
    if (!Number.isNaN(timeB)) return 1

    const idA = typeof a?.id === "number" ? a.id : Number.MAX_SAFE_INTEGER
    const idB = typeof b?.id === "number" ? b.id : Number.MAX_SAFE_INTEGER

    if (idA !== idB) {
      return idA - idB
    }

    const titleA = a?.title ?? ""
    const titleB = b?.title ?? ""
    return String(titleA).localeCompare(String(titleB))
  })

  const timelineImages = limitImagesPerDay(timelineImagesSorted)

  const totalImages = timelineImages.length
  const currentIndex =
    totalImages === 0 ? 0 : Math.min(requestedIndex, totalImages - 1)
  const currentImage =
    totalImages === 0 ? undefined : timelineImages[currentIndex]

  const visibleCards = CARD_LAYERS.map(({ indexOffset, style }, position) => {
    const imageIndex = currentIndex + indexOffset
    const image = timelineImages[imageIndex]

    if (!image) {
      return null
    }

    return {
      key: `image-card-${image.id ?? imageIndex}`,
      layoutId: `timeline-image-${image.id ?? imageIndex}`,
      src: image.file,
      alt: position === 0 ? getImageTitle(image) : "",
      style,
      isPrimary: position === 0,
    }
  }).filter(Boolean)

  const { groups: timelineGroups, indexMap: timelineIndexMap } =
    groupImagesByDay(timelineImages)

  const totalGroups = timelineGroups.length

  const currentTimelinePosition =
    totalGroups > 0 && currentIndex < timelineIndexMap.length
      ? timelineIndexMap[currentIndex]
      : null

  const currentGroupIndex = currentTimelinePosition?.groupIndex ?? 0

  const getGroupBottom = (groupIndex) =>
    TIMELINE_GROUP_BASE_BOTTOM +
    (groupIndex - currentGroupIndex) * TIMELINE_ROW_STEP

  const getGroupOpacity = (groupIndex) => {
    const relativeIndex = currentGroupIndex - groupIndex

    if (relativeIndex <= 0) {
      return 1
    }

    if (relativeIndex === 1) {
      return 0.5
    }

    return 0
  }

  const timelineHeight =
    totalGroups > 0
      ? Math.max(
          TIMELINE_MIN_HEIGHT,
          TIMELINE_VERTICAL_PADDING * 2 +
            (totalGroups - 1) * TIMELINE_ROW_STEP +
            TIMELINE_MARKER_HEIGHT,
        )
      : TIMELINE_MIN_HEIGHT

  const indicatorBottom = TIMELINE_INDICATOR_BASE_BOTTOM

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

  const currentMarkerWidth = getMarkerWidth(currentMarkerVisualIndex)
  const indicatorWidth = currentMarkerWidth + TIMELINE_INDICATOR_EXTRA

  const indicatorRight =
    getMarkerCenterRight(currentMarkerVisualIndex) - indicatorWidth / 2

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
    ? [dateLabel, timeLabel].filter((line) => Boolean(line))
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
        <ImageStack>
          <LayoutGroup id="future-timeline-stack">
            {visibleCards.map(
              ({ key, layoutId, src, alt, style, isPrimary }) => (
                <ImageCard
                  key={key}
                  layoutId={layoutId}
                  layout
                  initial={
                    isPrimary
                      ? {
                          opacity: 0,
                          scale: 0.8,
                        }
                      : undefined
                  }
                  animate={
                    isPrimary
                      ? {
                          opacity: 1,
                          scale: 1,
                        }
                      : undefined
                  }
                  transition={{
                    duration: isPrimary ? 0.4 : undefined,
                    ease: isPrimary ? "easeOut" : undefined,
                    layout: { type: "spring", stiffness: 260, damping: 30 },
                  }}
                  style={style}
                >
                  <img src={src} alt={alt} loading="lazy" />
                </ImageCard>
              ),
            )}
          </LayoutGroup>

          {showLoadingOverlay && (
            <StackOverlay>
              <LoadingSpinner text="Fetching future memories..." />
            </StackOverlay>
          )}

          {showErrorOverlay && (
            <StackOverlay>
              <OverlayMessage>
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while reaching the future."}
              </OverlayMessage>
            </StackOverlay>
          )}

          {showEmptyOverlay && (
            <StackOverlay>
              <OverlayMessage>
                No approved future timeline images are available yet.
              </OverlayMessage>
            </StackOverlay>
          )}
        </ImageStack>

        <InfoSection>
          <InfoContent>
            <Title>{infoTitle}</Title>
            <DateTime>
              {infoDescriptionLines.map((line, index) => (
                <p key={`timeline-info-line-${index}`}>{line}</p>
              ))}
            </DateTime>
          </InfoContent>
          <InfoDivider aria-hidden />
        </InfoSection>

        {totalGroups > 0 && (
          <Timeline style={{ "--timeline-height": `${timelineHeight}px` }}>
            {(() => {
              const initialIndicatorWidth =
                getMarkerWidth(0) + TIMELINE_INDICATOR_EXTRA

              return (
                <TimelineDot
                  initial={{
                    bottom:
                      TIMELINE_VERTICAL_PADDING -
                      (TIMELINE_MARKER_HEIGHT + TIMELINE_INDICATOR_EXTRA) / 2,
                    right: getMarkerCenterRight(0) - initialIndicatorWidth / 2,
                    width: initialIndicatorWidth,
                  }}
                  animate={{
                    bottom: indicatorBottom,
                    right: indicatorRight,
                    width: indicatorWidth,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )
            })()}
            {timelineGroups.map((group, groupIndex) => {
              const groupOpacity = getGroupOpacity(groupIndex)

              return (
                <TimelineGroup
                  key={`timeline-group-${group.dateKey}-${groupIndex}`}
                  initial={false}
                  animate={{
                    bottom: getGroupBottom(groupIndex),
                    opacity: groupOpacity,
                  }}
                  style={{ opacity: groupOpacity }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 30,
                  }}
                >
                  {group.items.map(({ image, globalIndex }, itemIndex) => {
                    const markerWidth = getMarkerWidth(itemIndex)
                    const markerColor = getMarkerColor(
                      image,
                      `${groupIndex}-${itemIndex}`,
                    )
                    const markerOpacity = (() => {
                      if (globalIndex === currentIndex) {
                        return 1
                      }

                      if (globalIndex < currentIndex) {
                        return 0.82
                      }

                      return 0.48
                    })()
                    const markerDateTime = formatDateTime(
                      image?.created_at,
                      locale,
                    )
                    const markerTitle =
                      [markerDateTime.dateLabel, markerDateTime.timeLabel]
                        .filter(Boolean)
                        .join(" · ") || "Future memory"

                    return (
                      <TimelineTickSlot
                        key={`timeline-tick-${
                          image.id ?? `${groupIndex}-${itemIndex}`
                        }`}
                        title={markerTitle}
                      >
                        <TimelineTick
                          $isCurrent={globalIndex === currentIndex}
                          $width={markerWidth}
                          $color={markerColor}
                          $opacity={markerOpacity}
                        />
                      </TimelineTickSlot>
                    )
                  })}
                </TimelineGroup>
              )
            })}
          </Timeline>
        )}
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
