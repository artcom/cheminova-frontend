import useGlobalState from "@/hooks/useGlobalState"
import { useEffect, useState } from "react"

import CharacterCarousel from "./components/CharacterCarousel"
import Intro from "./components/Intro"
import { CHARACTER_DATA } from "./constants"
import { MainLayoutContainer } from "./styles"

export default function CharacterShowcase() {
  const [showIntro, setShowIntro] = useState(true)
  const {
    setSelectedCharacter,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    goNext,
    handleCharacterPrev,
    handleCharacterNext,
    handleCharacterSelect,
    setHeadline,
    setDescription,
  } = useGlobalState()

  useEffect(() => {
    if (!showIntro) {
      const currentCharacter = CHARACTER_DATA[currentCharacterIndex]
      setSelectedCharacter(currentCharacter)
      setHeadline(currentCharacter.title)
      setDescription({
        title: currentCharacter.name,
        text: currentCharacter.description,
      })
    } else {
      setHeadline("La Nau")
      setDescription({
        title: "Choose your guide",
        text: "Select your guide for this immersive journey through La Nau.",
      })
    }
  }, [
    currentCharacterIndex,
    showIntro,
    setSelectedCharacter,
    setHeadline,
    setDescription,
  ])

  const handleIntroComplete = () => {
    setShowIntro(false)
    const currentCharacter = CHARACTER_DATA[currentCharacterIndex]
    setHeadline(currentCharacter.title)
    setDescription({
      title: currentCharacter.name,
      text: currentCharacter.description,
    })
  }

  const handleCharacterSelection = (index) => {
    setCurrentCharacterIndex(index)
    setShowIntro(false)
  }

  const handleCharacterChange = (newIndex) => {
    setCurrentCharacterIndex(newIndex)
  }

  const handleSelectAndContinue = () => {
    handleCharacterSelect()
  }

  const handleSingleNavigation = () => {
    if (showIntro) {
      handleIntroComplete()
    } else {
      goNext()
    }
  }

  return (
    <MainLayoutContainer>
      {showIntro ? (
        <Intro
          onCharacterSelect={handleCharacterSelection}
          onContinue={handleIntroComplete}
        />
      ) : (
        <CharacterCarousel
          selectedIndex={currentCharacterIndex}
          onSelectionChange={handleCharacterChange}
          onSelectCharacter={handleSelectAndContinue}
          onPrev={handleCharacterPrev}
          onNext={handleCharacterNext}
          onSingleNavigation={handleSingleNavigation}
        />
      )}
    </MainLayoutContainer>
  )
}
