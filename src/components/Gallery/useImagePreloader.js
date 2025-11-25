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

    // Check which ones are already done (e.g. from a previous mount)
    let initialCount = 0
    normalizedUrls.forEach((url) => {
      if (preloadedSet.has(url)) initialCount++
    })
    setPreloadedCount(initialCount)

    normalizedUrls.forEach((url) => {
      if (preloadedSet.has(url) || imagesMap.has(url)) {
        return
      }

      const img = new Image()

      const handleLoad = () => {
        if (!preloadedSet.has(url)) {
          preloadedSet.add(url)
          setPreloadedCount((prev) => prev + 1)
        }
        imagesMap.delete(url)
      }

      const handleError = () => {
        // Even on error, we count it as "processed" so we don't hang
        if (!preloadedSet.has(url)) {
          preloadedSet.add(url)
          setPreloadedCount((prev) => prev + 1)
        }
        imagesMap.delete(url)
      }

      img.addEventListener("load", handleLoad)
      img.addEventListener("error", handleError)

      imagesMap.set(url, { img, handleLoad, handleError })
      img.src = url
    })

    return () => {
      imagesMap.forEach(({ img, handleLoad, handleError }) => {
        img.removeEventListener("load", handleLoad)
        img.removeEventListener("error", handleError)
      })
      imagesMap.clear()
    }
  }, [normalizedUrls, shouldPreload])

  // Cleanup on unmount
  useEffect(() => {
    const mapSnapshot = imageElements.current
    // We don't clear preloadedImages ref on unmount so we remember what we loaded
    // if the user navigates back and forth.
    return () => {
      mapSnapshot.forEach(({ img, handleLoad, handleError }) => {
        img.removeEventListener("load", handleLoad)
        img.removeEventListener("error", handleError)
      })
      mapSnapshot.clear()
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
