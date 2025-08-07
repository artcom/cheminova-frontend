import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import useImagePreloader from "../../hooks/useImagePreloader"
import { useMemo } from "react"

import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"

const imagePixelSize = 300
const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

const getRandomHexColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")
}

export default function Gallery() {
  const imagePool = useMemo(() => {
    console.log("Generating image pool... (This will run only once)")
    return Array.from({ length: 50 }, () => {
      const bgColor = getRandomHexColor()
      const textColor = "FFFFFF"
      const text = `${imagePixelSize}x${imagePixelSize}`
      return `https://placehold.co/${imagePixelSize}x${imagePixelSize}/${bgColor}/${textColor}?text=${text}`
    })
  }, [])

  const allImages = useMemo(() => {
    return [...imagePool, ...personalImages]
  }, [imagePool])

  const { isLoading, loadedCount, totalImages } = useImagePreloader(allImages)

  if (isLoading) {
    return (
      <>
        <h1>Gallery</h1>
        <GalleryLoader loadedCount={loadedCount} totalImages={totalImages} />
      </>
    )
  }

  return (
    <>
      <h1>Gallery</h1>
      <div
        style={{
          width: "100%",
          height: "90vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
          }}
          style={{ touchAction: "none" }}
        >
          <GalleryContent imagePool={imagePool} targetTilesPerRow={5} />
        </Canvas>
      </div>
    </>
  )
}
