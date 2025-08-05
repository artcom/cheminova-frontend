import { useState } from "react"
import { styled } from "styled-components"
import MainLayout from "@ui/MainLayout"
import FullscreenButton from "@ui/FullscreenButton"
import Preload from "@components/Preload"
import { createMainLayoutScreens } from "./screenConfig.jsx"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.dark};
  position: relative;
`

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0)
  const mainLayoutScreens = createMainLayoutScreens(setScreenIndex)

  const currentScreen = mainLayoutScreens[screenIndex]

  const nextScreen = () =>
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  const prevScreen = () =>
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )

  return (
    <AppContainer>
      <Preload />
      <MainLayout
        {...currentScreen}
        onNext={nextScreen}
        onPrev={prevScreen}
        topRightAction={<FullscreenButton />}
      />
    </AppContainer>
  )
}
