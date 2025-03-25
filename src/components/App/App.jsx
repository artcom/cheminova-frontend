import useFullscreen from "../../hooks/useFullscreen"
import PhotoCapture from "../PhotoCapture"
import useGlobalState from "../../hooks/useGlobalState"

export default function App() {
  const { selectedCharacter, setSelectedCharacter } = useGlobalState()

  return (
    <>
      <h1> Cheminova Frontend</h1>
      <p> Selected Character: {selectedCharacter ?? "none Selected"}</p>
      <button
        onClick={() =>
          setSelectedCharacter(selectedCharacter === "bob" ? "alice" : "bob")
        }
      >
        Set selected character to{" "}
        {selectedCharacter === "bob" ? "alice" : "bob"}
      </button>
      <PhotoCapture />
      <FullscreenButton />
    </>
  )
}

function FullscreenButton() {
  const { isFullscreen, isIOSDevice, toggleFullscreen } = useFullscreen()

  if (isIOSDevice) {
    return null
  }

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </button>
  )
}
