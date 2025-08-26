import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"
import useGlobalState from "@hooks/useGlobalState"
import useImagePreloader from "@hooks/useImagePreloader"
import { useState } from "react"
import { styled } from "styled-components"

import Imprint from "@ui/Imprint"
import MainLayout from "@ui/MainLayout"
import Privacy from "@ui/Privacy"

import { createMainLayoutScreens } from "./screenConfig"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: ${(props) => (props.$scroll ? "scroll" : "hidden")};
  position: relative;
`

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0)
  const [showScreen, setShowScreen] = useState(null)
  const {
    selectedCharacter,
    setSelectedCharacter,
    currentCharacterIndex,
    setCurrentCharacterIndex,
  } = useGlobalState()

  const handleNextScreen = () => {
    setScreenIndex((screenIndex + 1) % 5)
  }

  const handlePrevScreen = () => {
    setScreenIndex((i) => (i - 1 + 5) % 5)
  }

  const characterNavHandlers = {
    onPrev: () => {
      const newIndex =
        currentCharacterIndex > 0
          ? currentCharacterIndex - 1
          : CHARACTER_DATA.length - 1
      setCurrentCharacterIndex(newIndex)
      setSelectedCharacter(CHARACTER_DATA[newIndex])
    },
    onNext: () => {
      const newIndex = (currentCharacterIndex + 1) % CHARACTER_DATA.length
      setCurrentCharacterIndex(newIndex)
      setSelectedCharacter(CHARACTER_DATA[newIndex])
    },
    onSelect: () => {
      setScreenIndex((prevIndex) => (prevIndex + 1) % 5)
    },
  }

  const mainLayoutScreens = createMainLayoutScreens(
    setScreenIndex,
    selectedCharacter,
    setSelectedCharacter,
    characterNavHandlers,
  )

  const characterImages = CHARACTER_DATA.map((character) => character.image)
  useImagePreloader(characterImages, screenIndex === 0)

  const currentScreen = mainLayoutScreens[screenIndex]

  return (
    <AppContainer $scroll={showScreen !== null}>
      {showScreen === "privacy" && <Privacy />}
      {showScreen === "imprint" && <Imprint />}
      {showScreen === null && (
        <MainLayout
          onNext={handleNextScreen}
          onPrev={handlePrevScreen}
          screenIndex={screenIndex}
          setShowScreen={setShowScreen}
          {...currentScreen}
        />
      )}
    </AppContainer>
  )
}
