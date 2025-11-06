import MobileOnlyGuard from "@/components/UI/MobileOnlyGuard"
import useGlobalState from "@/hooks/useGlobalState"
import useHistoryNavigation from "@/hooks/useHistoryNavigation"
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
import Upload from "../Upload"
import Welcome from "../Welcome"

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: ${(props) => (props.$scroll ? "scroll" : "hidden")};
  position: relative;
`

export default function App() {
  const { showModal } = useGlobalState()
  const [state, navigateToPage] = useHistoryNavigation("welcome")
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
          <Welcome
            goToIntroduction={() => {
              navigateToPage("introduction")
              handleClearImages()
            }}
          />
        )}
        {state === "introduction" && (
          <Introduction
            goToPhotoCapture={() => navigateToPage("photoCapture")}
          />
        )}
        {state === "photoCapture" && (
          <PhotoCapture
            goToExploration={() => navigateToPage("exploration")}
            onImageCaptured={handleImageCaptured}
            capturedImages={capturedImages}
          />
        )}
        {state === "exploration" && (
          <Exploration goToPerspective={() => navigateToPage("perspective")} />
        )}
        {state === "perspective" && (
          <Perspective goToUpload={() => navigateToPage("upload")} />
        )}
        {state === "upload" && (
          <Upload
            goToGallery={() => navigateToPage("gallery")}
            images={capturedImages}
          />
        )}
        {state === "gallery" && (
          <Gallery
            goToEnding={() => navigateToPage("ending")}
            capturedImages={capturedImages}
          />
        )}
        {state === "ending" && (
          <Ending goToWelcome={() => navigateToPage("welcome")} />
        )}
      </AppContainer>
    </MobileOnlyGuard>
  )
}
