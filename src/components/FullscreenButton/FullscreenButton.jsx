import { useState, useEffect } from "react"

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    const detectiOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return (
        /iphone|ipad|ipod|macintosh/.test(userAgent) && "ontouchend" in document
      )
    }

    setIsIOSDevice(detectiOS())

    if (!detectiOS()) {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      document.addEventListener("fullscreenchange", handleFullscreenChange)
      return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange)
      }
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  if (isIOSDevice) {
    return null
  }

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </button>
  )
}
