import { useEffect, useState } from "react"

export default function useDevicePlatform() {
  const [platform, setPlatform] = useState({
    os: "unknown",
    isIOS: false,
    isAndroid: false,
  })

  useEffect(() => {
    const userAgent = navigator.userAgent

    const isIOS =
      /iPhone|iPod/.test(userAgent) ||
      (/iPad/.test(userAgent) && !window.MSStream)
    const isAndroid = /android/i.test(userAgent)

    const os = isIOS
      ? "iOS"
      : isAndroid
        ? "Android"
        : /Windows/.test(userAgent)
          ? "Windows"
          : /Macintosh|Mac OS X/.test(userAgent)
            ? "MacOS"
            : /Linux/.test(userAgent)
              ? "Linux"
              : "unknown"

    setPlatform({ os, isIOS, isAndroid })
  }, [])

  return platform
}
