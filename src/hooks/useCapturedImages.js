import { CapturedImagesContext } from "@/providers/CapturedImagesContext"
import { useContext } from "react"

export default function useCapturedImages() {
  const context = useContext(CapturedImagesContext)

  if (context === null) {
    throw new Error(
      "useCapturedImages must be used within a CapturedImagesProvider",
    )
  }

  return context
}
