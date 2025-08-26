import useGlobalState from "@hooks/useGlobalState"
import { useEffect, useState } from "react"

import CharacterCarousel from "./components/CharacterCarousel"
import IntroScreen from "./components/IntroScreen"
import { CHARACTER_DATA } from "./constants"
import { MainLayoutContainer } from "./styles"

const CharacterShowcase = ({
  onCharacterSelected,
  onCharacterChange,
  onPrev,
  onNext,
  onSelect,
}) => {
  const [showIntro, setShowIntro] = useState(true)
  const {
    setSelectedCharacter,
    currentCharacterIndex,
    setCurrentCharacterIndex,
  } = useGlobalState()

  useEffect(() => {
    if (!showIntro) {
      const currentCharacter = CHARACTER_DATA[currentCharacterIndex]
      onCharacterChange?.(currentCharacter)
    }
  }, [currentCharacterIndex, showIntro, onCharacterChange])

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  const handleCharacterSelection = (index) => {
    setCurrentCharacterIndex(index)
    setShowIntro(false)
  }

  const handleCharacterChange = (newIndex) => {
    setCurrentCharacterIndex(newIndex)
  }

  const handleSelectCharacter = () => {
    const selectedCharacter = CHARACTER_DATA[currentCharacterIndex]
    setSelectedCharacter(selectedCharacter)
    onCharacterSelected?.()
  }

  const handlePrevCharacter = () => {
    if (onPrev) {
      onPrev()
      return
    }

    const newIndex =
      currentCharacterIndex > 0
        ? currentCharacterIndex - 1
        : CHARACTER_DATA.length - 1
    setCurrentCharacterIndex(newIndex)
  }

  const handleNextCharacter = () => {
    if (onNext) {
      onNext()
      return
    }

    const newIndex = (currentCharacterIndex + 1) % CHARACTER_DATA.length
    setCurrentCharacterIndex(newIndex)
  }

  const handleSelectAndContinue = () => {
    handleSelectCharacter()
    onSelect?.()
  }

  const handleSingleNavigation = () => {
    if (showIntro) {
      handleIntroComplete()
    } else {
      onNext?.()
    }
  }

  return (
    <MainLayoutContainer>
      {showIntro ? (
        <IntroScreen
          onCharacterSelect={handleCharacterSelection}
          onContinue={handleIntroComplete}
        />
      ) : (
        <CharacterCarousel
          selectedIndex={currentCharacterIndex}
          onSelectionChange={handleCharacterChange}
          onSelectCharacter={handleSelectAndContinue}
          onPrev={handlePrevCharacter}
          onNext={handleNextCharacter}
          onSingleNavigation={handleSingleNavigation}
        />
      )}
    </MainLayoutContainer>
  )
}

export default CharacterShowcase
