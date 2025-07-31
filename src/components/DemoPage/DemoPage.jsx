import { useState } from "react"
import Button from "@ui/Button"
import Header from "@ui/Header"
import IconButton from "@ui/IconButton"
import MainLayout from "@ui/MainLayout"
import useFullscreen from "@hooks/useFullscreen"
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
    headline: "Main Layout Headline 2",
    subheadline: "Optional Subheadline 2",
    descriptionTitle: "Description Title 2",
    descriptionText: "This is the description text for the second main layout.",
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
      <Header headline="Demo Page" subheadline="This is a demo page" />
      <Button onClick={() => console.log("Button clicked!")}>Click Me!</Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <IconButton
          variant="arrowDown"
          onClick={() => console.log("Arrow Down clicked!")}
        />
        <IconButton
          disabled
          variant="arrowDown"
          onClick={() => console.log("Arrow Down clicked!")}
        />
        <IconButton
          variant="camera"
          onClick={() => console.log("Camera clicked!")}
        />
        <IconButton
          disabled
          variant="camera"
          onClick={() => console.log("Camera clicked!")}
        />
      </div>
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
