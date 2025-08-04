import { useState } from "react"
import IconButton from "@ui/IconButton"
import MainLayout from "@ui/MainLayout"
import CharacterShowcase from "@components/CharacterShowcase"
import PhotoCapture from "@components/PhotoCapture"
import useFullscreen from "@hooks/useFullscreen"
import LaNau from "@ui/LaNau.webp"

export default function DemoPage() {
  const [screenIndex, setScreenIndex] = useState(0)
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

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
        <CharacterShowcase onCharacterSelected={() => setScreenIndex(2)} />
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
      fullscreenComponent: <PhotoCapture />,
    },
  ]

  const nextScreen = () =>
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  const prevScreen = () =>
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )

  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "black",
        position: "relative",
      }}
    >
      <MainLayout
        key={screenIndex}
        {...mainLayoutScreens[screenIndex]}
        onPrev={prevScreen}
        onNext={nextScreen}
        topRightAction={
          !isIOSDevice ? (
            <IconButton
              variant="fullscreen"
              onClick={toggleFullscreen}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 10,
              }}
            />
          ) : null
        }
      />
    </div>
  )
}
