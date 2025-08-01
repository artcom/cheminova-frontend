import { useState } from "react"
import { MainLayoutContainer, CharacterButtonLayout } from "./styles"
import Button from "@ui/Button"
import IconButton from "@ui/IconButton"
import { TransitionWrapper } from "./components/TransitionWrapper"
import { IntroScreen } from "./components/IntroScreen"
import { CharacterCarousel } from "./components/CharacterCarousel"
import { CHARACTER_THEMES, INTRO_GRADIENT, CHARACTER_DATA } from "./constants"
import useGlobalState from "@hooks/useGlobalState"

const CharacterShowcase = ({ onCharacterSelected }) => {
  const [showIntro, setShowIntro] = useState(true)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(1)
  const { setSelectedCharacter } = useGlobalState()

  // Get theme colors based on current state
  const themeColors = showIntro
    ? INTRO_GRADIENT
    : CHARACTER_THEMES[currentCharacterIndex]

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  const handleCharacterSelection = (index) => {
    setCurrentCharacterIndex(index)
    if (showIntro) {
      setShowIntro(false)
    }
  }

  const handlePrevCharacter = () => {
    const newIndex =
      currentCharacterIndex > 0
        ? currentCharacterIndex - 1
        : CHARACTER_DATA.length - 1
    setCurrentCharacterIndex(newIndex)
  }

  const handleNextCharacter = () => {
    const newIndex =
      currentCharacterIndex < CHARACTER_DATA.length - 1
        ? currentCharacterIndex + 1
        : 0
    setCurrentCharacterIndex(newIndex)
  }

  const handleSelectCharacter = () => {
    const selectedCharacter = CHARACTER_DATA[currentCharacterIndex]
    setSelectedCharacter(selectedCharacter.name.toLowerCase())
    if (onCharacterSelected) {
      onCharacterSelected()
    }
  }

  const ContainerComponent = MainLayoutContainer

  return (
    <ContainerComponent
      animate={{
        background: `linear-gradient(135deg, ${themeColors[0]} 0%, ${themeColors[1]} 100%)`,
      }}
      transition={{
        background: { duration: 0.8, ease: "easeOut" },
      }}
    >
      <TransitionWrapper isActive={showIntro}>
        <IntroScreen
          onCharacterSelect={handleCharacterSelection}
          onContinue={handleIntroComplete}
        />
      </TransitionWrapper>

      <TransitionWrapper isActive={!showIntro}>
        <CharacterCarousel
          selectedIndex={currentCharacterIndex}
          onSelectionChange={setCurrentCharacterIndex}
        />
      </TransitionWrapper>

      {/* Show navigation buttons only when not in intro */}
      {!showIntro && (
        <CharacterButtonLayout>
          <IconButton variant="arrowLeft" onClick={handlePrevCharacter} />
          <Button onClick={handleSelectCharacter}>Select</Button>
          <IconButton variant="arrowRight" onClick={handleNextCharacter} />
        </CharacterButtonLayout>
      )}
    </ContainerComponent>
  )
}

export default CharacterShowcase
