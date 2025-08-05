import { useState, Suspense, lazy } from "react"
import { styled } from "styled-components"
import MainLayout from "@ui/MainLayout"
import FullscreenButton from "@ui/FullscreenButton"
import Preload from "@components/Preload"
import LaNau from "@ui/assets/LaNau.webp"

const LazyCharacterShowcase = lazy(
  () => import("@components/CharacterShowcase"),
)
const LazyPhotoCapture = lazy(() => import("@components/PhotoCapture"))

const AppContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  background-color: black;
  position: relative;
`

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0)

  const mainLayoutScreens = [
    {
      headline: "La Nau",
      subheadline: "Experiencing",
      descriptionTitle: "Welcome to Camp Nou",
      descriptionText:
        "Discover the magic of FC Barcelona's legendary stadium through immersive experiences.",
      backgroundImage: LaNau,
      vignetteIntensity: 30,
      navigationMode: "single",
      singleButtonVariant: "arrowDown",
    },
    {
      fullscreenComponent: (
        <Suspense fallback={<div>Loading Character Showcase...</div>}>
          <LazyCharacterShowcase
            onCharacterSelected={() => setScreenIndex(2)}
          />
        </Suspense>
      ),
    },
    {
      headline: "Character Selected!",
      subheadline: "Your journey begins",
      descriptionTitle: "Welcome to your adventure",
      descriptionText:
        "You have successfully selected your character. Your personalized experience awaits!",
      vignetteIntensity: 20,
      backgroundImage: LaNau,
      navigationMode: "dual",
    },
    {
      headline: "Ready to Explore",
      subheadline: "The adventure continues",
      descriptionTitle: "Discover Camp Nou",
      descriptionText:
        "Step into the world of FC Barcelona and explore every corner of this iconic stadium. Your personalized journey through history awaits.",
      vignetteIntensity: 25,
      backgroundImage: LaNau,
      navigationMode: "dual",
    },
    {
      fullscreenComponent: (
        <Suspense fallback={<div>Loading Photo Capture...</div>}>
          <LazyPhotoCapture />
        </Suspense>
      ),
    },
  ]

  const nextScreen = () =>
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  const prevScreen = () =>
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )

  return (
    <AppContainer>
      <Preload screenIndex={screenIndex}>
        <MainLayout
          key={screenIndex}
          {...mainLayoutScreens[screenIndex]}
          onPrev={prevScreen}
          onNext={nextScreen}
          topRightAction={<FullscreenButton />}
        />
      </Preload>
    </AppContainer>
  )
}
