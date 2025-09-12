import MobileOnlyGuard from "@/components/UI/MobileOnlyGuard"
import useGlobalState from "@/hooks/useGlobalState"
import { useEffect, useRef, useState } from "react"
import { styled } from "styled-components"

import Imprint from "@ui/Imprint"
import Privacy from "@ui/Privacy"

import Exploration from "../Exploration"
import Gallery from "../Gallery"
import Introduction from "../Introduction"
import Perspective from "../Perspective"
import PhotoCapture from "../PhotoCapture"
import Upload from "../Upload"
import Welcome from "../Welcome"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: ${(props) => (props.$scroll ? "scroll" : "hidden")};
  position: relative;
`

export default function App() {
  const { showModal, setScreens, goNext } = useGlobalState()

  const [state, setState] = useState("welcome") // "welcome", "introductio", "photoCapture", "exploration", "perspective", "upload", "gallery"

  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
  }, [goNext, setScreens])

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

  return (
    <MobileOnlyGuard>
      <AppContainer>
        {state === "welcome" && (
          <Welcome goToIntroduction={() => setState("introduction")} />
        )}
        {state === "introduction" && (
          <Introduction goToPhotoCapture={() => setState("photoCapture")} />
        )}
        {state === "photoCapture" && (
          <PhotoCapture goToExploration={() => setState("exploration")} />
        )}
        {state === "exploration" && (
          <Exploration goToPerspective={() => setState("perspective")} />
        )}
        {state === "perspective" && (
          <Perspective goToUpload={() => setState("upload")} />
        )}
        {state === "upload" && (
          <Upload goToGallery={() => setState("gallery")} />
        )}
        {state === "gallery" && <Gallery />}
      </AppContainer>
    </MobileOnlyGuard>
  )
}
