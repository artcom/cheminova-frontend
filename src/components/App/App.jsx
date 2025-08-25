import { useState, useCallback, useMemo } from "react"
import { styled } from "styled-components"
import MainLayout from "@ui/MainLayout"
import useImagePreloader from "@hooks/useImagePreloader"
import useGlobalState from "@hooks/useGlobalState"
import { createMainLayoutScreens } from "./screenConfig.jsx"
import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  position: relative;
`

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0)
  const {
    selectedCharacter,
    setSelectedCharacter,
    currentCharacterIndex,
    setCurrentCharacterIndex,
  } = useGlobalState()

  const handleNextScreen = useCallback(() => {
    const nextIndex = (screenIndex + 1) % 5
    setScreenIndex(nextIndex)
  }, [screenIndex])

  const characterNavHandlers = useMemo(
    () => ({
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
    }),
    [currentCharacterIndex, setCurrentCharacterIndex, setSelectedCharacter],
  )

  const mainLayoutScreens = createMainLayoutScreens(
    setScreenIndex,
    selectedCharacter,
    setSelectedCharacter,
    characterNavHandlers,
  )

  const characterImages = CHARACTER_DATA.map((character) => character.image)
  useImagePreloader(characterImages, screenIndex === 0)

  const currentScreen = mainLayoutScreens[screenIndex]

  const handlePrevScreen = () => {
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )
  }

  return (
    <AppContainer>
      <MainLayout
        onNext={handleNextScreen}
        onPrev={handlePrevScreen}
        screenIndex={screenIndex}
        {...currentScreen}
      />
    </AppContainer>
  )
}
