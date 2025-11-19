import { useCallback, useMemo, useState } from "react"

import { CapturedImagesContext } from "./CapturedImagesContext"

export function CapturedImagesProvider({ children }) {
  const [capturedImages, setCapturedImages] = useState([])

  const setCapturedImageAt = useCallback((index, imageData) => {
    setCapturedImages((previous) => {
      const next = [...previous]
      next[index] = imageData
      return next
    })
  }, [])

  const clearCapturedImages = useCallback(() => {
    setCapturedImages([])
  }, [])

  const value = useMemo(
    () => ({
      capturedImages,
      setCapturedImageAt,
      clearCapturedImages,
    }),
    [capturedImages, setCapturedImageAt, clearCapturedImages],
  )

  return (
    <CapturedImagesContext.Provider value={value}>
      {children}
    </CapturedImagesContext.Provider>
  )
}
