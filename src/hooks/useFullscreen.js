import { useEffect, useState } from "react"

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const detectiOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return (
        /iphone|ipad|ipod|macintosh/.test(userAgent) && "ontouchend" in document
      )
    }

    const isIOS = detectiOS()
    setIsIOSDevice(isIOS)

    if (!isIOS) {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement)
      }

      document.addEventListener("fullscreenchange", handleFullscreenChange, {
        signal,
      })
    }

    return () => abortController.abort()
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return { isFullscreen, isIOSDevice, toggleFullscreen }
}

export default useFullscreen
