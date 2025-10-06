import useGlobalState from "@/hooks/useGlobalState"
import { useEffect, useState } from "react"

import LaNau from "@ui/assets/LaNau.webp"
import Description from "@ui/Description"
import FullscreenButton from "@ui/FullscreenButton"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

import CharacterShowcase from "./CharacterShowcase"
import { CHARACTER_DATA } from "./CharacterShowcase/constants"
import { config } from "./config"
import { ChildrenContainer, Layout, TextLayout } from "./styles"

// Step definition constants to avoid magic numbers and improve readability
const STEP = Object.freeze({
  INTRO: 0,
  CHARACTER: 1,
})

export default function Welcome({ goToIntroduction }) {
  const [step, setStep] = useState(STEP.INTRO)
  const [content, setContent] = useState(config.steps[0])
  const [showIntro, setShowIntro] = useState(true)
  const { currentCharacterIndex, setCurrentCharacterIndex } = useGlobalState()

  useEffect(() => {
    if (step === STEP.CHARACTER && showIntro) {
      // When first entering character step but still in intro, reflect the second config step
      setContent(config.steps[1])
    }
  }, [step, showIntro])

  const advanceFromIntro = () => setStep(STEP.CHARACTER)
  const confirmCharacter = () => {
    setShowIntro(false)
  }
  const proceedAfterConfirmation = () => goToIntroduction()

  const onSelect = () => {
    if (step === STEP.INTRO) return advanceFromIntro()
    if (step === STEP.CHARACTER && showIntro) return confirmCharacter()
    if (step === STEP.CHARACTER && !showIntro) return proceedAfterConfirmation()
  }

  function handleCharacterPrev() {
    if (currentCharacterIndex === 0) return
    setCurrentCharacterIndex(currentCharacterIndex - 1)
  }

  function handleCharacterNext() {
    const last = CHARACTER_DATA.length - 1
    if (currentCharacterIndex === last) return
    setCurrentCharacterIndex(currentCharacterIndex + 1)
  }

  const headline = content.headline
  const subHeadline = content.subHeadline
  const description = content.description
  const navigationMode = content.navigationMode

  return (
    <Layout $backgroundImage={LaNau}>
      {step < STEP.CHARACTER && <FullscreenButton />}
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
        /* Pass disabled state via data attributes consumed by IconButton if needed */
        prevDisabled={currentCharacterIndex === 0}
        nextDisabled={currentCharacterIndex === CHARACTER_DATA.length - 1}
      />
      <Vignette />
    </Layout>
  )
}
