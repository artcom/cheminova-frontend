import { useEffect, useRef, useState } from "react"

/**
 * Custom hook for preloading images
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @param {boolean} shouldPreload - Whether to start preloading
 * @returns {object} - Preload status and utilities
 */
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
        // Skip if already preloaded
        if (preloadedImages.current.has(url)) {
          return
        }

        // Create image element for preloading
        const img = new Image()

        img.onload = () => {
          preloadedImages.current.add(url)
          setPreloadedCount(preloadedImages.current.size)
          console.log(`✅ Preloaded image: ${url}`)
        }

        img.onerror = () => {
          console.warn(`❌ Failed to preload image: ${url}`)
        }

        // Store reference to prevent garbage collection
        imageElements.current.set(url, img)

        // Start loading
        img.src = url
      })
    }

    // Small delay to avoid blocking main thread
    const timeoutId = setTimeout(preloadImages, 100)

    return () => {
      clearTimeout(timeoutId)
      // Clean up image references
      imageElements.current.clear()
    }
  }, [imageUrls, shouldPreload])

  // Cleanup on unmount
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
  }
}

export default useImagePreloader
