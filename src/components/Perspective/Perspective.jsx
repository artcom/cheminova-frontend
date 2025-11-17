import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import { Alignment, Fit } from "@rive-app/react-canvas"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import { styled } from "styled-components"

import LoadingSpinner from "../UI/LoadingSpinner"
import Navigation from "../UI/Navigation"
import RiveAnimation from "../UI/RiveAnimation"

const Screen = styled(motion.div)`
  position: relative;
  width: 100dvw;
  height: 100dvh;
  padding: 0.5rem 1.625rem calc(var(--safe-inset-bottom) + 7rem) 1.625rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
  overflow: hidden;
`

const BackgroundImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${(props) =>
    props.$imageUrl ? `url(${props.$imageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  z-index: 0;
  transition: opacity 0.5s ease-in-out;
`

const RiveBackground = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`

const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Headline = styled(motion.h1)`
  margin-top: 1.75rem;
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 2.325rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 1.5rem;
  opacity: ${(props) => (props.$isLoading ? "0.5" : "1")};
  transition: opacity 0.3s ease-in-out;
`

const Description = styled(motion.div)`
  width: 21.375rem;
  max-width: 100%;
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 2rem;
  opacity: ${(props) => (props.$isLoading ? "0.5" : "1")};
  transition: opacity 0.3s ease-in-out;
`

const LoadingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`

const NavigationWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  margin-top: auto;
`

const easeOutExpo = [0.22, 1, 0.36, 1]

const screenVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
      delayChildren: 0.15,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: easeOutExpo } },
}

const backgroundVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.35 },
  exit: { opacity: 0 },
}

const riveVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function Perspective() {
  const { characterSlug, perspective, riveAsset } = useLoaderData()
  const [imageLoaded, setImageLoaded] = useState(false)
  const navigate = useNavigate()
  const isLoading = false
  const showRiveAnimation = Boolean(riveAsset)

  useEffect(() => {
    if (showRiveAnimation) {
      return undefined
    }

    const imageUrl = perspective?.backgroundImage?.file || null

    if (!imageUrl) {
      const timeoutId = setTimeout(() => setImageLoaded(false), 0)
      return () => clearTimeout(timeoutId)
    }

    const resetTimeoutId = setTimeout(() => setImageLoaded(false), 0)
    const img = new Image()
    const handleLoad = () => setImageLoaded(true)
    const handleError = () => setImageLoaded(false)
    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)
    img.src = imageUrl

    return () => {
      clearTimeout(resetTimeoutId)
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }
  }, [perspective?.backgroundImage?.file, showRiveAnimation])

  const heading = perspective?.heading || ""
  const description = perspective?.description
    ? perspective.description.replace(/<[^>]*>/g, "")
    : ""

  const backgroundImageUrl =
    !showRiveAnimation && imageLoaded && perspective?.backgroundImage?.file
      ? perspective.backgroundImage.file
      : null

  const riveLayout = showRiveAnimation
    ? characterSlug === "future"
      ? {
          fit: Fit.Cover,
          alignment: Alignment.CenterLeft,
        }
      : { fit: Fit.Cover, alignment: Alignment.Center }
    : undefined

  return (
    <Screen
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.8, ease: easeOutExpo }}
    >
      <AnimatePresence mode="wait">
        {!showRiveAnimation && backgroundImageUrl && (
          <BackgroundImage
            key={backgroundImageUrl}
            $imageUrl={backgroundImageUrl}
            variants={backgroundVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1.1, ease: easeOutExpo }}
          />
        )}

        {showRiveAnimation && (
          <RiveBackground
            key={riveAsset ?? characterSlug}
            variants={riveVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.9, ease: easeOutExpo }}
          >
            <RiveAnimation
              src={riveAsset}
              autoplay
              stopAfterFirstLoop={characterSlug === "future"}
              layout={riveLayout}
            />
          </RiveBackground>
        )}
      </AnimatePresence>

      <Content variants={contentVariants} initial="initial" animate="animate">
        <Headline $isLoading={isLoading} variants={itemVariants}>
          {heading}
        </Headline>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingContainer
              key="loading"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            description && (
              <Description
                key={description}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {description}
              </Description>
            )
          )}
        </AnimatePresence>
      </Content>

      <NavigationWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.3 }}
      >
        <Navigation
          mode="single"
          onSelect={() => navigate(`/characters/${characterSlug}/upload`)}
          disabled={isLoading}
        />
      </NavigationWrapper>
    </Screen>
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

  const perspective = extractFromContentTree.getPerspective(
    content,
    characterIndex,
  )

  if (!perspective) {
    throw new Response("Perspective not found", { status: 404 })
  }

  const riveAsset =
    characterSlug === "future"
      ? "/timeline.riv"
      : characterSlug === "janitor"
        ? "/mateosgaze.riv"
        : null

  const preloadPromises = []

  if (riveAsset) {
    preloadPromises.push(
      fetch(riveAsset)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to preload Rive animation: ${riveAsset}`)
          }
          return response.blob()
        })
        .catch((error) => {
          console.warn(error)
          return null
        }),
    )
  }

  if (preloadPromises.length > 0) {
    await Promise.all(preloadPromises)
  }

  return { characterIndex, characterSlug, perspective, riveAsset }
}
