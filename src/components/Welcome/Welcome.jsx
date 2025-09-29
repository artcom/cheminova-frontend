import {
  useCharacterOverviewFromAll,
  useCharactersFromAll,
  useWelcomeFromAll,
} from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useEffect, useState } from "react"

import LaNau from "@ui/assets/LaNau.webp"
import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

import CharacterShowcase from "./CharacterShowcase"
import { config } from "./config"
import { ChildrenContainer, Layout, TextLayout } from "./styles"

const STEP = Object.freeze({
  INTRO: 0,
  CHARACTER: 1,
})

export default function Welcome({ goToIntroduction }) {
  const [step, setStep] = useState(STEP.INTRO)
  const [content, setContent] = useState(config.steps[0])
  const [showIntro, setShowIntro] = useState(true)
  const { currentCharacterIndex, setCurrentCharacterIndex } = useGlobalState()

  const { data: welcomeData, isLoading: welcomeLoading } = useWelcomeFromAll()
  const { data: characterOverviewData, isLoading: characterOverviewLoading } =
    useCharacterOverviewFromAll()
  const { data: charactersData, isLoading: charactersLoading } =
    useCharactersFromAll()

  console.log("Welcome Data:", welcomeData)
  console.log("Character Overview Data:", characterOverviewData)
  console.log("Characters Data:", charactersData)

  useEffect(() => {
    if (step === STEP.CHARACTER && showIntro) {
      setContent(config.steps[1])
    }
  }, [step, showIntro])

  const advanceFromIntro = () => setStep(STEP.CHARACTER)
  const confirmCharacter = () => {
    setShowIntro(false)
  }

  const onSelect = () => {
    if (step === STEP.INTRO) return advanceFromIntro()
    if (step === STEP.CHARACTER && showIntro) return confirmCharacter()
    if (step === STEP.CHARACTER && !showIntro) return goToIntroduction()
  }

  function handleCharacterPrev() {
    if (currentCharacterIndex === 0) return
    setCurrentCharacterIndex(currentCharacterIndex - 1)
  }

  function handleCharacterNext() {
    const totalCharacters = charactersData?.length || 0
    const last = totalCharacters - 1
    if (currentCharacterIndex === last) return
    setCurrentCharacterIndex(currentCharacterIndex + 1)
  }

  const getContent = () => {
    if (step === STEP.INTRO && welcomeData) {
      return {
        headline: welcomeData.title,
        subHeadline: welcomeData.siteName,
        description: {
          title: "",
          text: welcomeData.description,
        },
        navigationMode: content.navigationMode,
      }
    } else if (step === STEP.CHARACTER && showIntro) {
      return {
        headline: characterOverviewData.title,
        description: {
          title: "",
          text: characterOverviewData.onboarding.replace(/<[^>]*>/g, ""),
        },
        navigationMode: content.navigationMode,
      }
    } else if (step === STEP.CHARACTER && !showIntro && charactersData) {
      const character = charactersData[currentCharacterIndex]
      return {
        headline: character.name,
        subHeadline: character.role,
        description: {
          title: "",
          text: character.description.replace(/<[^>]*>/g, ""),
        },
      }
    }
    return content
  }

  const { headline, subHeadline, description, navigationMode } = getContent()

  const getBackgroundImage = () => {
    if (step === STEP.INTRO && welcomeData?.backgroundImage?.file) {
      return welcomeData.backgroundImage.file
    } else if (
      step === STEP.CHARACTER &&
      characterOverviewData?.backgroundImage?.file
    ) {
      return characterOverviewData.backgroundImage.file
    }
    return LaNau
  }

  if (
    (step === STEP.INTRO && welcomeLoading) ||
    (step === STEP.CHARACTER && (characterOverviewLoading || charactersLoading))
  ) {
    return (
      <Layout $backgroundImage={LaNau}>
        <TextLayout>
          <Header headline="Loading..." />
        </TextLayout>
      </Layout>
    )
  }

  return (
    <Layout $backgroundImage={getBackgroundImage()}>
      {step === STEP.CHARACTER && (
        <ChildrenContainer>
          <CharacterShowcase
            onSelect={() => setStep(2)}
            setContent={setContent}
            showIntro={showIntro}
            setShowIntro={setShowIntro}
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
      <Navigation
        mode={!showIntro ? "select" : navigationMode}
        position="default"
        onSelect={onSelect}
        onPrev={handleCharacterPrev}
        onNext={handleCharacterNext}
        prevDisabled={currentCharacterIndex === 0}
        nextDisabled={
          currentCharacterIndex === (charactersData?.length || 0) - 1
        }
      />
      <Vignette />
    </Layout>
  )
}
