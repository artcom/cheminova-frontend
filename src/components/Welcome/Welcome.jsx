import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { preloadImages, WELCOME_LAYER_IMAGES } from "@/utils/preloadImages"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

import LaNau from "@ui/assets/LaNau.webp"
import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

import CharacterShowcase from "./CharacterShowcase"
import { STEP } from "./constants"
import { useWelcomeBackground } from "./hooks/useWelcomeBackground"
import { useWelcomeContent } from "./hooks/useWelcomeContent"
import { useWelcomeSteps } from "./hooks/useWelcomeSteps"
import IntroLanguageChooser from "./IntroLanguageChooser"
import {
  ChildrenContainer,
  LayerImage,
  LayersContainer,
  Layout,
  TextLayout,
} from "./styles"

// Inline layer configuration with animations
const PARALLAX_LAYERS = [
  {
    id: "third",
    src: "/layer/layer_third.png",
    initial: { x: "-120%", y: 100, scale: 0.9, opacity: 0 },
    animate: { x: "-110%", y: "-10%", scale: 1, opacity: 1 },
    exit: { x: "-120%", y: -100, scale: 1.1, opacity: 0 },
    transition: { duration: 1.2, ease: "easeOut" },
  },
  {
    id: "second",
    src: "/layer/layer_second.png",
    initial: { x: "-40%", y: 150, scale: 0.9, opacity: 0 },
    animate: { x: "-50%", y: "5%", scale: 1, opacity: 1 },
    exit: { x: "-40%", y: -150, scale: 1.2, opacity: 0 },
    transition: { duration: 1.0, ease: "easeOut" },
  },
  {
    id: "front",
    src: "/layer/layer_front.png",
    initial: { x: "-50%", y: 200, scale: 0.8, opacity: 0 },
    animate: { x: "-50%", y: "20%", scale: 1, opacity: 1 },
    exit: { x: "-50%", y: -200, scale: 1.3, opacity: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
]

// Create motion component once outside the component to prevent re-creation on each render
const MotionLayerImage = motion.create(LayerImage)

export default function Welcome() {
  const [showIntro, setShowIntro] = useState(true)
  const {
    currentCharacterIndex,
    setCurrentCharacterIndex,
    clearCapturedImages,
  } = useGlobalState()
  const navigate = useNavigate()
  console.info(
    "showIntro:",
    showIntro,
    "currentCharacterIndex:",
    currentCharacterIndex,
  )

  const { welcome, characterOverview, characters } = useLoaderData()

  const welcomeData = welcome
  const characterOverviewData = characterOverview
  const charactersData = characters

  console.log("Welcome component loaded data:", {
    welcomeData,
    characterOverviewData,
    charactersData,
  })

  const handleGoToIntroduction = () => {
    clearCapturedImages()
    navigate(`/characters/${currentCharacterIndex}/introduction`)
  }

  const { step, setStep, getNavigationProps } = useWelcomeSteps({
    goToIntroduction: handleGoToIntroduction,
    showIntro,
    setShowIntro,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    charactersData,
  })

  const { headline, subHeadline, description, navigationMode } =
    useWelcomeContent(step, showIntro, currentCharacterIndex, {
      charactersData,
      characterOverviewData,
    })

  const backgroundImage = useWelcomeBackground(
    step,
    welcomeData,
    characterOverviewData,
  )

  return (
    <Layout $backgroundImage={backgroundImage}>
      <AnimatePresence mode="wait">
        {step === STEP.INTRO && (
          <LayersContainer key="intro-layers">
            {PARALLAX_LAYERS.map((layer) => (
              <MotionLayerImage
                key={layer.id}
                src={layer.src}
                alt=""
                initial={layer.initial}
                animate={layer.animate}
                exit={layer.exit}
                transition={layer.transition}
              />
            ))}
          </LayersContainer>
        )}
      </AnimatePresence>
      {step === STEP.INTRO && <IntroLanguageChooser />}
      {step === STEP.CHARACTER && (
        <ChildrenContainer>
          <CharacterShowcase
            onSelect={() => setStep(2)}
            showIntro={showIntro}
            setShowIntro={setShowIntro}
            characters={charactersData}
          />
        </ChildrenContainer>
      )}
      <TextLayout $hasDescription={!!description}>
        {headline && (
          <Header
            headline={headline}
            subheadline={subHeadline}
            legalNotice={step === STEP.INTRO}
          />
        )}

        {description && (
          <Description
            title={description.title}
            text={description.text}
            headline={headline}
            subheadline={subHeadline}
          />
        )}
      </TextLayout>
      <Navigation position="default" {...getNavigationProps(navigationMode)} />
      <Vignette />
    </Layout>
  )
}

export const id = "welcome"

export async function clientLoader() {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)

  const [content] = await Promise.all([
    queryClient.ensureQueryData(query),
    preloadImages(WELCOME_LAYER_IMAGES),
  ])

  const welcome = extractFromContentTree.getWelcome(content)
  const characterOverview = extractFromContentTree.getCharacterOverview(content)
  const characters = extractFromContentTree.getCharacters(content)

  const backgroundImages = [
    LaNau,
    welcome?.backgroundImage?.file,
    characterOverview?.backgroundImage?.file,
  ].filter(Boolean)

  await preloadImages(backgroundImages)

  return {
    welcome,
    characterOverview,
    characters,
  }
}
