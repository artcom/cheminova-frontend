import { useState } from "react"
import IconButton from "@ui/IconButton"
import MainLayout from "@ui/MainLayout"
import useFullscreen from "@hooks/useFullscreen"
import CharacterShowcase from "@components/CharacterShowcase"
import LaNau from "../UI/LaNau.jpg"

const mainLayoutScreens = [
  {
    headline: "Main Layout Headline 1",
    subheadline: "Optional Subheadline 1",
    descriptionTitle: "Description Title 1",
    descriptionText: "This is the description text for the first main layout.",
    backgroundImage: LaNau,
  },
  {
    fullscreenComponent: <CharacterShowcase isInMainLayout={true} />,
  },
]

export default function DemoPage() {
  const [screenIndex, setScreenIndex] = useState(0)
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

  const nextScreen = () =>
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  const prevScreen = () =>
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )

  return (
    <div
      style={{
        backgroundColor: "lightgray",
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
