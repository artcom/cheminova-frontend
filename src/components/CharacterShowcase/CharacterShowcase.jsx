import { useState, useEffect } from "react"
import { MainLayoutContainer } from "./styles"
import { CHARACTER_DATA } from "./constants"
import useGlobalState from "@hooks/useGlobalState"
import IntroScreen from "./components/IntroScreen"
import CharacterCarousel from "./components/CharacterCarousel"

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
    if (!showIntro && onCharacterChange) {
      const currentCharacter = CHARACTER_DATA[currentCharacterIndex]
      onCharacterChange(currentCharacter)
    }
  }, [currentCharacterIndex, showIntro, onCharacterChange])

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  const handleCharacterSelection = (index) => {
    setCurrentCharacterIndex(index)
    if (showIntro) {
      setShowIntro(false)
    }
  }

  const handleCharacterChange = (newIndex) => {
    setCurrentCharacterIndex(newIndex)
  }

  const handleSelectCharacter = () => {
    const selectedCharacter = CHARACTER_DATA[currentCharacterIndex]
    setSelectedCharacter(selectedCharacter)
    if (onCharacterSelected) {
      onCharacterSelected()
    }
  }

  const handlePrevCharacter = () => {
    if (onPrev) {
      onPrev()
    } else {
      const newIndex =
        currentCharacterIndex > 0
          ? currentCharacterIndex - 1
          : CHARACTER_DATA.length - 1
      setCurrentCharacterIndex(newIndex)
    }
  }

  const handleNextCharacter = () => {
    if (onNext) {
      onNext()
    } else {
      const newIndex = (currentCharacterIndex + 1) % CHARACTER_DATA.length
      setCurrentCharacterIndex(newIndex)
    }
  }

  const handleSelectAndContinue = () => {
    handleSelectCharacter()
    if (onSelect) onSelect()
  }

  const handleSingleNavigation = () => {
    if (showIntro) {
      handleIntroComplete()
    } else {
      if (onNext) onNext()
    }
  }

  const ContainerComponent = MainLayoutContainer

  return (
    <ContainerComponent>
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
    </ContainerComponent>
  )
}

export default CharacterShowcase
