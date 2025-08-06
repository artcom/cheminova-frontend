import { useState, useCallback } from "react"
import { styled } from "styled-components"
import MainLayout from "@ui/MainLayout"
import useImagePreloader from "@hooks/useImagePreloader"
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
  const mainLayoutScreens = createMainLayoutScreens(setScreenIndex)

  const characterImages = CHARACTER_DATA.map((character) => character.image)
  useImagePreloader(characterImages, screenIndex === 0)

  const currentScreen = mainLayoutScreens[screenIndex]

  const handleNextScreen = useCallback(() => {
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  }, [mainLayoutScreens.length])

  const handlePrevScreen = () => {
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )
  }

  return (
    <AppContainer>
      <MainLayout
        {...currentScreen}
        onNext={handleNextScreen}
        onPrev={handlePrevScreen}
      />
    </AppContainer>
  )
}
