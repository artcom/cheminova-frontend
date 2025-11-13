import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import LoadingSpinner from "@/components/UI/LoadingSpinner"
import { useFutureTimelineImages } from "@/hooks/useFutureTimelineImages"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import theme from "@theme"
import { LayoutGroup, motion } from "motion/react"
import { useState } from "react"
import { useLoaderData } from "react-router-dom"
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

const Timeline = styled.div`
  position: fixed;
  right: 5px;
  bottom: 5rem;
  height: 400px;
  width: 2px;
  background: linear-gradient(
    to top,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
`

const TimelineDot = styled(motion.div)`
  position: absolute;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  right: -2px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  transform: translateY(-50%);
`

const TimelineTick = styled.div`
  position: absolute;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  left: calc(50% - 0.5rem);
  transform: translate(-50%, -50%);
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
const getStepPercentage = (index, total) => {
  if (total <= 1) {
    return 0
  }

  return (index / (total - 1)) * 100
}

const getTickWidth = () => 3 + Math.floor(Math.random() * 4)

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
  useLoaderData() // Ensures loader runs and validates character
  const [requestedIndex, setRequestedIndex] = useState(0)

  const locale = getCurrentLocale()
  const {
    data: futureImages = [],
    isLoading,
    isError,
    error,
  } = useFutureTimelineImages()

  const totalImages = futureImages.length
  const currentIndex =
    totalImages === 0 ? 0 : Math.min(requestedIndex, totalImages - 1)
  const currentImage =
    totalImages === 0 ? undefined : futureImages[currentIndex]

  const progress = getStepPercentage(currentIndex, totalImages)

  const visibleCards = CARD_LAYERS.map(({ indexOffset, style }, position) => {
    const imageIndex = currentIndex + indexOffset
    const image = futureImages[imageIndex]

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

  const showLoadingOverlay = isLoading && totalImages === 0
  const showErrorOverlay = isError && totalImages === 0
  const showEmptyOverlay = !isLoading && !isError && totalImages === 0
  const nextDisabled = totalImages === 0 || currentIndex >= totalImages - 1

  return (
    <Page>
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

        {totalImages > 0 && (
          <Timeline>
            <TimelineDot
              initial={{ top: "100%" }}
              animate={{ top: `${100 - progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            {futureImages.map((image, index) => (
              <TimelineTick
                key={`timeline-tick-${image.id ?? index}`}
                style={{
                  top: `${100 - getStepPercentage(index, totalImages)}%`,
                  width: `${getTickWidth(index)}px`,
                }}
              />
            ))}
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
  const characterSlug = params.characterId
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characters = extractFromContentTree.getCharacters(content)
  const characterIndex = findCharacterIndexBySlug(characters, characterSlug)

  if (characterIndex === null) {
    throw new Response("Character not found", { status: 404 })
  }

  return { characterIndex, characterSlug }
}
