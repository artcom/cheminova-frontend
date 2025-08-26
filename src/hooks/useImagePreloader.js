import { useEffect, useRef, useState } from "react"

const useImagePreloader = (imageUrls = [], shouldPreload = true) => {
  const preloadedImages = useRef(new Set())
  const imageElements = useRef(new Map())
  const [preloadedCount, setPreloadedCount] = useState(0)

  useEffect(() => {
    if (!shouldPreload || !imageUrls.length) return

    const imagesMap = imageElements.current
    const preloadedSet = preloadedImages.current

    const preloadImages = () => {
      imageUrls.forEach((url) => {
        if (preloadedSet.has(url)) return

        const img = new Image()

        img.onload = () => {
          preloadedSet.add(url)
          setPreloadedCount(preloadedSet.size)
        }

        imagesMap.set(url, img)
        img.src = url
      })
    }

    const timeoutId = setTimeout(preloadImages, 100)
    return () => {
      clearTimeout(timeoutId)
      imagesMap.clear()
    }
  }, [imageUrls, shouldPreload])

  useEffect(() => {
    const imagesMap = imageElements.current
    const preloadedSet = preloadedImages.current
    return () => {
      imagesMap.clear()
      preloadedSet.clear()
      setPreloadedCount(0)
    }
  }, [])

  return {
    isPreloaded: (url) => preloadedImages.current.has(url),
    preloadedCount,
    totalCount: imageUrls.length,
    isAllPreloaded: imageUrls.length > 0 && preloadedCount === imageUrls.length,
  }
}

export default useImagePreloader
