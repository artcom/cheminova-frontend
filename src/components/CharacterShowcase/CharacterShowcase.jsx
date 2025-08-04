import { useState } from "react"
import { MainLayoutContainer, CharacterButtonLayout } from "./styles"
import Button from "@ui/Button"
import IconButton from "@ui/IconButton"
import { CHARACTER_THEMES, INTRO_GRADIENT, CHARACTER_DATA } from "./constants"
import useGlobalState from "@hooks/useGlobalState"
import IntroScreen from "./components/IntroScreen"
import CharacterCarousel from "./components/CharacterCarousel"
const CharacterShowcase = ({ onCharacterSelected }) => {
  const [showIntro, setShowIntro] = useState(true)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(1)
  const { setSelectedCharacter } = useGlobalState()

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
      {showIntro ? (
        <IntroScreen
          onCharacterSelect={handleCharacterSelection}
          onContinue={handleIntroComplete}
        />
      ) : (
        <CharacterCarousel
          selectedIndex={currentCharacterIndex}
          onSelectionChange={setCurrentCharacterIndex}
        />
      )}

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
