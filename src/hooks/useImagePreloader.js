import { useEffect, useRef, useState } from "react"

const useImagePreloader = (imageUrls = [], shouldPreload = true) => {
  const preloadedImages = useRef(new Set())
  const imageElements = useRef(new Map())
  const [preloadedCount, setPreloadedCount] = useState(0)

  useEffect(() => {
    if (!shouldPreload || !imageUrls.length) {
      return
    }

    const preloadImages = () => {
      imageUrls.forEach((url) => {
        if (preloadedImages.current.has(url)) {
          return
        }

        const img = new Image()

        img.onload = () => {
          preloadedImages.current.add(url)
          setPreloadedCount(preloadedImages.current.size)
          console.log(`✅ Preloaded image: ${url}`)
        }

        img.onerror = () => {
          console.warn(`❌ Failed to preload image: ${url}`)
        }

        imageElements.current.set(url, img)
        img.src = url
      })
    }

    const timeoutId = setTimeout(preloadImages, 100)

    return () => {
      clearTimeout(timeoutId)
      imageElements.current.clear()
    }
  }, [imageUrls, shouldPreload])

  useEffect(() => {
    return () => {
      imageElements.current.clear()
      preloadedImages.current.clear()
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
