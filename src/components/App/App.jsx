import useFullscreen from "../../hooks/useFullscreen"

export default function App() {
  return (
    <>
      <h1>Cheminova Frontend</h1>
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
