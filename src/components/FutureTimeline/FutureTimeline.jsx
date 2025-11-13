import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
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

// Import Cologne Cathedral images
const cologneImages = import.meta.glob("../Gallery/CologneCathedral/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
})

// Convert glob to array
const getImageArray = () => {
  return Object.entries(cologneImages)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url)
}

const getStepPercentage = (index, total) => {
  if (total <= 1) {
    return 0
  }

  return (index / (total - 1)) * 100
}

const getTickWidth = () => 3 + Math.floor(Math.random() * 4)

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
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = getImageArray()
  const progress = getStepPercentage(currentIndex, images.length)
  const visibleCards = CARD_LAYERS.map(({ indexOffset, style }, position) => {
    const imageIndex = currentIndex + indexOffset
    const image = images[imageIndex]

    if (!image) {
      return null
    }

    return {
      key: `image-card-${imageIndex}`,
      layoutId: `timeline-image-${imageIndex}`,
      image,
      style,
      isPrimary: position === 0,
    }
  }).filter(Boolean)

  // Mock timeline data - in future, this should come from CMS/API
  const timelineData = {
    title: "An Ornament",
    date: "April 9, 2026",
    time: "15:23",
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <Page>
      <TimelineContainer>
        <ImageStack>
          <LayoutGroup id="future-timeline-stack">
            {visibleCards.map(({ key, layoutId, image, style, isPrimary }) => (
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
                <img src={image} alt={isPrimary ? timelineData.title : ""} />
              </ImageCard>
            ))}
          </LayoutGroup>
        </ImageStack>

        <InfoSection>
          <InfoContent>
            <Title>{timelineData.title}</Title>
            <DateTime>
              <p>{timelineData.date}</p>
              <p>{timelineData.time}</p>
            </DateTime>
          </InfoContent>
          <InfoDivider aria-hidden />
        </InfoSection>

        <Timeline>
          <TimelineDot
            initial={{ top: "100%" }}
            animate={{ top: `${100 - progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          {images.map((_, index) => (
            <TimelineTick
              key={`timeline-tick-${index}`}
              style={{
                top: `${100 - getStepPercentage(index, images.length)}%`,
                width: `${getTickWidth(index)}px`,
              }}
            />
          ))}
        </Timeline>
      </TimelineContainer>

      <ChevronWrapper>
        <ChevronButton
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
