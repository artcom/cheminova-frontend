import { CapturedImagesContext } from "@/providers/CapturedImagesProvider"
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
