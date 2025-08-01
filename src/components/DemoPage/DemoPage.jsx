import { useState } from "react"
import IconButton from "@ui/IconButton"
import MainLayout from "@ui/MainLayout"
import useFullscreen from "@hooks/useFullscreen"
import CharacterShowcase from "@components/CharacterShowcase"
import LaNau from "../UI/LaNau.jpg"

export default function DemoPage() {
  const [screenIndex, setScreenIndex] = useState(0)
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

  const handleCharacterSelected = () => {
    setScreenIndex(2) // Go to page 3 (index 2)
  }

  const mainLayoutScreens = [
    {
      headline: "La Nau",
      subheadline: "Experiencing",
      backgroundImage: LaNau,
      vignetteIntensity: 50,
    },
    {
      fullscreenComponent: (
        <CharacterShowcase onCharacterSelected={handleCharacterSelected} />
      ),
    },
    {
      headline: "Character Selected!",
      subheadline: "Your journey begins",
      descriptionTitle: "Welcome to your adventure",
      descriptionText:
        "You have successfully selected your character. Your personalized experience awaits!",
      vignetteIntensity: 20,
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
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "lightgray",
        position: "relative",
      }}
    >
      <MainLayout
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
