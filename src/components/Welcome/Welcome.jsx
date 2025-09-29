import {
  useCharacterOverviewFromAll,
  useCharactersFromAll,
  useWelcomeFromAll,
} from "@/api/hooks"
import {  useState } from "react"
import { useTranslation } from "react-i18next"

import LaNau from "@ui/assets/LaNau.webp"
import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

import CharacterShowcase from "./CharacterShowcase"
import { ChildrenContainer, Layout, TextLayout } from "./styles"

const STEP = Object.freeze({
  INTRO: 0,
  CHARACTER: 1,
})

export default function Welcome({ goToIntroduction }) {
  const [step, setStep] = useState(STEP.INTRO)
  const [showIntro, setShowIntro] = useState(true)
  const { t } = useTranslation()
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)

  const { data: welcomeData, isLoading: welcomeLoading } = useWelcomeFromAll()
  const { data: characterOverviewData, isLoading: characterOverviewLoading } =
    useCharacterOverviewFromAll()
  const { data: charactersData, isLoading: charactersLoading } =
    useCharactersFromAll()

  console.log("Welcome Data:", welcomeData)
  console.log("Character Overview Data:", characterOverviewData)
  console.log("Characters Data:", charactersData)

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
    if (step === STEP.INTRO) {
      return {
        headline: t("welcome.title"),
        subHeadline: t("welcome.subtitle"),
        description: {
          title: "",
          text: t("welcome.description"),
        },
        navigationMode: "single",
      }
    } else if (step === STEP.CHARACTER && showIntro) {
      return {
        headline: t("introduction.title"),
        description: {
          title: "",
          text: t("introduction.description"),
        },
        navigationMode: "single",
      }
    } else if (
      step === STEP.CHARACTER &&
      !showIntro &&
      charactersData &&
      charactersData[currentCharacterIndex]
    ) {
      const character = charactersData[currentCharacterIndex]
      return {
        headline: character.name,
        subHeadline: character.role,
        description: {
          title: "",
          text: character.description.replace(/<[^>]*>/g, ""),
        },
        navigationMode: "double",
      }
    }
  }

  const { headline, subHeadline, description, navigationMode } =
    getContent() || {}

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
