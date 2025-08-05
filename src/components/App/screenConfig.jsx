import { Suspense, lazy } from "react"
import LaNau from "@ui/assets/LaNau.webp"

const LazyCharacterShowcase = lazy(
  () => import("@components/CharacterShowcase"),
)
const LazyPhotoCapture = lazy(() => import("@components/PhotoCapture"))

export const createMainLayoutScreens = (setScreenIndex) => [
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
        <LazyCharacterShowcase onCharacterSelected={() => setScreenIndex(2)} />
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
