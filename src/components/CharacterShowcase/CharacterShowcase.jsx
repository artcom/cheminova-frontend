import { useState, Suspense, lazy } from "react"
import { MainLayoutContainer, CharacterButtonLayout } from "./styles"
import Button from "@ui/Button"
import IconButton from "@ui/IconButton"
import { CHARACTER_THEMES, INTRO_GRADIENT, CHARACTER_DATA } from "./constants"
import useGlobalState from "@hooks/useGlobalState"

const LazyTransitionWrapper = lazy(() =>
  import("./components/TransitionWrapper").then((m) => ({
    default: m.TransitionWrapper,
  })),
)
const LazyIntroScreen = lazy(() =>
  import("./components/IntroScreen").then((m) => ({ default: m.IntroScreen })),
)
const LazyCharacterCarousel = lazy(() =>
  import("./components/CharacterCarousel").then((m) => ({
    default: m.CharacterCarousel,
  })),
)

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
      <Suspense fallback={<div>Loading…</div>}>
        <LazyTransitionWrapper isActive={showIntro}>
          <LazyIntroScreen
            onCharacterSelect={handleCharacterSelection}
            onContinue={handleIntroComplete}
          />
        </LazyTransitionWrapper>
      </Suspense>

      <Suspense fallback={<div>Loading…</div>}>
        <LazyTransitionWrapper isActive={!showIntro}>
          <LazyCharacterCarousel
            selectedIndex={currentCharacterIndex}
            onSelectionChange={setCurrentCharacterIndex}
          />
        </LazyTransitionWrapper>
      </Suspense>

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
