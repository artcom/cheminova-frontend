import { createContext, useState } from "react"

export const StateContext = createContext()

export default function StateProvider({ children }) {
  const [capturedImages, setCapturedImages] = useState([])

  function setCapturedImageAt(index, imageData) {
    setCapturedImages((prev) => {
      const next = [...prev]
      next[index] = imageData
      return next
    })
  }
  const clearCapturedImages = () => {
    setCapturedImages([])
  }

  const value = {
    capturedImages,
    setCapturedImageAt,
    clearCapturedImages,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
