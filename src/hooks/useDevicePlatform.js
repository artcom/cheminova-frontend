import { useEffect, useState } from "react"

export default function useDevicePlatform() {
  const [platform, setPlatform] = useState({
    os: "unknown",
    isIOS: false,
    isAndroid: false,
  })

  useEffect(() => {
    const userAgent = navigator.userAgent || ""

    const isIOS =
      /iPhone|iPod/.test(userAgent) ||
      (/iPad/.test(userAgent) && !window.MSStream)

    const isAndroid = /android/i.test(userAgent)
    let os = "unknown"
    if (isIOS) {
      os = "iOS"
    } else if (isAndroid) {
      os = "Android"
    } else if (/Windows/.test(userAgent)) {
      os = "Windows"
    } else if (/Macintosh|Mac OS X/.test(userAgent)) {
      os = "MacOS"
    } else if (/Linux/.test(userAgent)) {
      os = "Linux"
    }

    setPlatform({ os, isIOS, isAndroid })
  }, [])

  return platform
}
