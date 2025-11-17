import { extractFromContentTree } from "@/api/hooks"
import { getCharacterSlug } from "@/utils/characterSlug"
import { loadCmsContent } from "@/utils/loaderHelpers"
import { preloadImages } from "@/utils/preloadImages"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

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

// Create motion component once outside the component to prevent re-creation on each render
const MotionLayerImage = motion.create(LayerImage)

export default function Welcome() {
  const [showIntro, setShowIntro] = useState(true)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const [languageChooserVisible, setLanguageChooserVisible] = useState(true)
  const navigate = useNavigate()

  const { welcomeLanguage, welcomeIntro, characterOverview, characters } =
    useLoaderData()

  const PARALLAX_LAYERS = [
    {
      id: "third",
      src: welcomeIntro.backgroundImageLayer3.file,
      initial: { x: "-120%", y: 100, scale: 0.9, opacity: 0 },
      animate: { x: "-110%", y: "-10%", scale: 1, opacity: 1 },
      exit: { x: "-120%", y: -100, scale: 1.1, opacity: 0 },
      transition: { duration: 1.2, ease: "easeOut" },
    },
    {
      id: "second",
      src: welcomeIntro.backgroundImageLayer2.file,
      initial: { x: "-40%", y: 150, scale: 0.9, opacity: 0 },
      animate: { x: "-50%", y: "5%", scale: 1, opacity: 1 },
      exit: { x: "-40%", y: -150, scale: 1.2, opacity: 0 },
      transition: { duration: 1.0, ease: "easeOut" },
    },
    {
      id: "front",
      src: welcomeIntro.backgroundImageLayer1.file,
      initial: { x: "-50%", y: 200, scale: 0.8, opacity: 0 },
      animate: { x: "-50%", y: "20%", scale: 1, opacity: 1 },
      exit: { x: "-50%", y: -200, scale: 1.3, opacity: 0 },
      transition: { duration: 0.8, ease: "easeOut" },
    },
  ]

  // Get the URL for the currently selected character's introduction route
  const currentCharacter = characters[currentCharacterIndex]
  const currentCharacterSlug = currentCharacter
    ? getCharacterSlug(currentCharacter, characters)
    : null

  const handleGoToIntroduction = () => {
    if (currentCharacterSlug) {
      navigate(`/characters/${currentCharacterSlug}/introduction`)
    }
  }

  const { step, getNavigationProps } = useWelcomeSteps({
    goToIntroduction: handleGoToIntroduction,
    showIntro,
    setShowIntro,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    charactersData: characters,
  })

  const { headline, subHeadline, description, navigationMode } =
    useWelcomeContent(step, showIntro, currentCharacterIndex, {
      charactersData: characters,
      characterOverviewData: characterOverview,
      welcomeIntroData: welcomeIntro,
    })

  const backgroundImage = useWelcomeBackground(
    step,
    welcomeIntro,
    characterOverview,
  )

  // Build the href for the select button when a character is selected
  const selectHref =
    step === STEP.CHARACTER && !showIntro && currentCharacterSlug
      ? `/characters/${currentCharacterSlug}/introduction`
      : undefined

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
      {step === STEP.INTRO && (
        <IntroLanguageChooser
          welcomeLanguage={welcomeLanguage}
          onLanguageSelected={() => setLanguageChooserVisible(false)}
        />
      )}
      {step === STEP.CHARACTER && (
        <ChildrenContainer>
          <CharacterShowcase
            showIntro={showIntro}
            setShowIntro={setShowIntro}
            characters={characters}
            currentCharacterIndex={currentCharacterIndex}
            setCurrentCharacterIndex={setCurrentCharacterIndex}
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

        {!(step === STEP.INTRO && languageChooserVisible) && description && (
          <Description
            title={description.title}
            text={description.text}
            headline={headline}
            subheadline={subHeadline}
          />
        )}
      </TextLayout>
      {!(step === STEP.INTRO && languageChooserVisible) && (
        <Navigation
          position="default"
          selectHref={selectHref}
          {...getNavigationProps(navigationMode)}
        />
      )}
      <Vignette />
    </Layout>
  )
}

export const id = "welcome"

export async function clientLoader() {
  const { content } = await loadCmsContent()

  const welcomeLanguage = extractFromContentTree.getWelcomeLanguage(content)
  const welcomeIntro = extractFromContentTree.getWelcomeIntro(content)
  const characterOverview = extractFromContentTree.getCharacterOverview(content)
  const characters = extractFromContentTree.getCharacters(content)

  // Collect all layer images from CMS
  const layerImages = [
    welcomeIntro.backgroundImageLayer1.file,
    welcomeIntro.backgroundImageLayer2.file,
    welcomeIntro.backgroundImageLayer3.file,
  ]

  // Collect all background images
  const backgroundImages = [
    welcomeIntro.backgroundImage.file,
    characterOverview.backgroundImage.file,
  ]

  // Preload all images in parallel
  await Promise.all([
    preloadImages(layerImages),
    preloadImages(backgroundImages),
  ])

  return {
    welcomeLanguage,
    welcomeIntro,
    characterOverview,
    characters,
  }
}
