import { useState } from "react"
import { styled } from "styled-components"
import MainLayout from "@ui/MainLayout"
import Preload from "@components/Preload"
import { createMainLayoutScreens } from "./screenConfig.jsx"
import { AnimatePresence } from "motion/react"

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
      <AnimatePresence>
        <MainLayout
          key={screenIndex}
          {...currentScreen}
          onNext={nextScreen}
          onPrev={prevScreen}
        />
      </AnimatePresence>
    </AppContainer>
  )
}
