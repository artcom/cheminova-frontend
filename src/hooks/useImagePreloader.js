import { useState, useEffect } from "react"

export default function useImagePreloader(imageUrls) {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [errorImages, setErrorImages] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setLoadedImages(new Set())
    setErrorImages(new Set())

    const loadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image()

        img.onload = () => {
          if (isMounted) {
            setLoadedImages((prev) => new Set([...prev, url]))
          }
          resolve({ url, success: true })
        }

        img.onerror = () => {
          if (isMounted) {
            setErrorImages((prev) => new Set([...prev, url]))
          }
          resolve({ url, success: false })
        }

        img.src = url
      })
    }

    const loadAllImages = async () => {
      const promises = imageUrls.map(loadImage)
      await Promise.all(promises)

      if (isMounted) {
        setIsLoading(false)
      }
    }

    loadAllImages()

    return () => {
      isMounted = false
    }
  }, [imageUrls])

  return {
    isLoading,
    loadedImages,
    errorImages,
    totalImages: imageUrls?.length || 0,
    loadedCount: loadedImages.size,
    errorCount: errorImages.size,
  }
}
