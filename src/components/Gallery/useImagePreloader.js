// Moved from src/hooks/useImagePreloader.js
import { useEffect, useMemo, useRef, useState } from "react"

const useImagePreloader = (imageUrls = [], shouldPreload = true) => {
  const preloadedImages = useRef(new Set())
  const imageElements = useRef(new Map())
  const [preloadedCount, setPreloadedCount] = useState(0)

  const normalizedUrls = useMemo(() => {
    if (!Array.isArray(imageUrls)) {
      return []
    }

    return Array.from(
      new Set(
        imageUrls
          .filter((url) => typeof url === "string" && url.length > 0)
          .map((url) => url.trim()),
      ),
    )
  }, [imageUrls])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (!shouldPreload || normalizedUrls.length === 0) {
      return
    }

    const imagesMap = imageElements.current
    const preloadedSet = preloadedImages.current

    const preloadImages = () => {
      normalizedUrls.forEach((url) => {
        if (preloadedSet.has(url) || imagesMap.has(url)) {
          return
        }

        const img = new Image()

        const handleLoad = () => {
          if (!preloadedSet.has(url)) {
            preloadedSet.add(url)
            setPreloadedCount(preloadedSet.size)
          }
          imagesMap.delete(url)
        }

        const handleError = () => {
          imagesMap.delete(url)
        }

        img.addEventListener("load", handleLoad)
        img.addEventListener("error", handleError)

        imagesMap.set(url, { img, handleLoad, handleError })
        img.src = url
      })
    }

    const timeoutId = setTimeout(preloadImages, 50)

    return () => {
      clearTimeout(timeoutId)
      imagesMap.forEach(({ img, handleLoad, handleError }) => {
        img.removeEventListener("load", handleLoad)
        img.removeEventListener("error", handleError)
      })
      imagesMap.clear()
    }
  }, [normalizedUrls, shouldPreload])

  useEffect(() => {
    const allowed = new Set(normalizedUrls)
    const preloadedSet = preloadedImages.current
    let removed = false

    preloadedSet.forEach((url) => {
      if (!allowed.has(url)) {
        preloadedSet.delete(url)
        removed = true
      }
    })

    if (removed) {
      setPreloadedCount(preloadedSet.size)
    }
  }, [normalizedUrls])

  useEffect(() => {
    const mapSnapshot = imageElements.current
    const preloadedSnapshot = preloadedImages.current

    return () => {
      mapSnapshot.forEach(({ img, handleLoad, handleError }) => {
        img.removeEventListener("load", handleLoad)
        img.removeEventListener("error", handleError)
      })
      mapSnapshot.clear()
      preloadedSnapshot.clear()
    }
  }, [])

  const totalImages = normalizedUrls.length
  const clampedLoaded = Math.min(preloadedCount, totalImages)
  const isLoading =
    shouldPreload && totalImages > 0 && clampedLoaded < totalImages

  return {
    isLoading,
    loadedCount: clampedLoaded,
    totalImages,
    isComplete: totalImages > 0 && clampedLoaded >= totalImages,
    isPreloaded: (url) => preloadedImages.current.has(url),
  }
}

export default useImagePreloader
