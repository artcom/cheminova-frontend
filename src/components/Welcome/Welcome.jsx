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

export default function Welcome({ goToIntroduction }) {
  const [step, setStep] = useState(0)
  const [content, setContent] = useState(config.steps[0])
  const [showIntro, setShowIntro] = useState(true)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)

  useEffect(() => {
    if (step === 1) {
      setContent(config.steps[1])
      return
    }
  }, [step])

  const onSelect = () => {
    if (step === 0) {
      setStep(1)
      return
    }
    if (step === 1 && showIntro) {
      // Keep current selection (default 0) rather than forcing index 1
      console.log("Character confirmed:", CHARACTER_DATA[currentCharacterIndex])
      setShowIntro(false)
    }
    if (step === 1 && !showIntro) {
      goToIntroduction()
    }
  }

  function handleCharacterPrev() {
    const total = CHARACTER_DATA.length
    const newIndex = (currentCharacterIndex - 1 + total) % total
    setCurrentCharacterIndex(newIndex)
  }

  function handleCharacterNext() {
    const total = CHARACTER_DATA.length
    const newIndex = (currentCharacterIndex + 1) % total
    setCurrentCharacterIndex(newIndex)
  }

  const headline = content.headline
  const subHeadline = content.subHeadline
  const description = content.description
  const navigationMode = content.navigationMode

  return (
    <Layout $backgroundImage={LaNau}>
      {step < 1 && <FullscreenButton />}
      {step === 1 && (
        <ChildrenContainer>
          <CharacterShowcase
            onSelect={() => setStep(2)}
            setContent={setContent}
            showIntro={showIntro}
            setShowIntro={setShowIntro}
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
            legalNotice={step === 0}
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
      />
      <Vignette />
    </Layout>
  )
}
