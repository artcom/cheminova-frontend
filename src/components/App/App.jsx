import useGlobalState from "@/hooks/useGlobalState"
import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"
import useImagePreloader from "@hooks/useImagePreloader"
import { useEffect } from "react"
import { styled } from "styled-components"

import Imprint from "@ui/Imprint"
import Privacy from "@ui/Privacy"

import LayoutRenderer from "./LayoutRenderer"
import { createScreens } from "./screens"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: ${(props) => (props.$scroll ? "scroll" : "hidden")};
  position: relative;
`

export default function App() {
  const {
    currentScreenIndex,
    currentScreen,
    showModal,
    setScreens,
    setShowModal,
    goNext,
    selectedCharacter,
  } = useGlobalState()

  const screens = createScreens(selectedCharacter, goNext)

  useEffect(() => {
    setScreens(screens)
  }, [screens, setScreens])

  const characterImages = () =>
    CHARACTER_DATA.map((character) => character.image)

  useImagePreloader(characterImages, currentScreenIndex === 0)

  const handleShowModal = (modalType) => setShowModal(modalType)

  if (showModal === "privacy") {
    return (
      <AppContainer $scroll>
        <Privacy />
      </AppContainer>
    )
  }

  if (showModal === "imprint") {
    return (
      <AppContainer $scroll>
        <Imprint />
      </AppContainer>
    )
  }

  if (!currentScreen) {
    return (
      <AppContainer>
        <div>Loading...</div>
      </AppContainer>
    )
  }

  return (
    <AppContainer>
      <LayoutRenderer screen={currentScreen} setShowScreen={handleShowModal} />
    </AppContainer>
  )
}
