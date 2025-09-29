import MobileOnlyGuard from "@/components/UI/MobileOnlyGuard"
import useGlobalState from "@/hooks/useGlobalState"
import { useState } from "react"
import { styled } from "styled-components"

import Imprint from "@ui/Imprint"
import Privacy from "@ui/Privacy"

import Ending from "../Ending"
import Exploration from "../Exploration"
import Gallery from "../Gallery"
import Introduction from "../Introduction"
import Perspective from "../Perspective"
import PhotoCapture from "../PhotoCapture"
import LanguageSelector from "../UI/LanguageSelector"
import Upload from "../Upload"
import Welcome from "../Welcome"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: ${(props) => (props.$scroll ? "scroll" : "hidden")};
  position: relative;
`

const LanguageSelectorContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
`

export default function App() {
  const { showModal } = useGlobalState()
  const [state, setState] = useState("welcome")
  const [capturedImages, setCapturedImages] = useState([])

  const handleImageCaptured = (imageData) => {
    setCapturedImages((prev) => [...prev, imageData])
  }

  const handleClearImages = () => {
    setCapturedImages([])
  }

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
          <>
            <Welcome
              goToIntroduction={() => {
                setState("introduction")
                handleClearImages()
              }}
            />
            <LanguageSelectorContainer>
              <LanguageSelector />
            </LanguageSelectorContainer>
          </>
        )}
        {state === "introduction" && (
          <Introduction goToPhotoCapture={() => setState("photoCapture")} />
        )}
        {state === "photoCapture" && (
          <PhotoCapture
            goToExploration={() => setState("exploration")}
            onImageCaptured={handleImageCaptured}
            capturedImages={capturedImages}
          />
        )}
        {state === "exploration" && (
          <Exploration goToPerspective={() => setState("perspective")} />
        )}
        {state === "perspective" && (
          <Perspective goToUpload={() => setState("upload")} />
        )}
        {state === "upload" && (
          <Upload
            goToGallery={() => setState("gallery")}
            images={capturedImages}
          />
        )}
        {state === "gallery" && (
          <Gallery
            goToEnding={() => setState("ending")}
            capturedImages={capturedImages}
          />
        )}
        {state === "ending" && (
          <Ending goToWelcome={() => setState("welcome")} />
        )}
      </AppContainer>
    </MobileOnlyGuard>
  )
}
