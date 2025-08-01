import { useState } from "react"
import { Container, MainLayoutContainer } from "./styles"
import { TransitionWrapper } from "./components/TransitionWrapper"
import { IntroScreen } from "./components/IntroScreen"
import { CharacterCarousel } from "./components/CharacterCarousel"
import { CHARACTER_THEMES, INTRO_GRADIENT } from "./constants"

const CharacterShowcase = ({ isInMainLayout = false }) => {
  const [showIntro, setShowIntro] = useState(true)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(1)

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

  const ContainerComponent = isInMainLayout ? MainLayoutContainer : Container

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
    </ContainerComponent>
  )
}

export default CharacterShowcase
