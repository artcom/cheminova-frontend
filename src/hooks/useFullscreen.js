import { useState, useEffect } from "react"

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const detectiOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      const regex = new RegExp("iphone|ipad|ipod|macintosh")
      return regex.test(userAgent) && "ontouchend" in document
    }

    setIsIOSDevice(detectiOS())

    if (!detectiOS()) {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      document.addEventListener("fullscreenchange", handleFullscreenChange, {
        signal,
      })
    }

    return () => {
      abortController.abort()
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

  return { isFullscreen, isIOSDevice, toggleFullscreen }
}

export default useFullscreen
