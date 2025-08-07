import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import { useMemo } from "react"

const TILES_PER_ROW = 10
const TILES_PER_COLUMN = 5
const TOTAL_TILES = TILES_PER_ROW * TILES_PER_COLUMN
const imagePixelSize = 300

const getRandomHexColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")
}

export default function Gallery() {
  const images = useMemo(() => {
    console.log("Generating image array... (This will run only once)")

    return Array.from({ length: TOTAL_TILES }, () => {
      const bgColor = getRandomHexColor()
      const textColor = "FFFFFF"
      const text = `${imagePixelSize}x${imagePixelSize}`
      return `https://placehold.co/${imagePixelSize}x${imagePixelSize}/${bgColor}/${textColor}?text=${text}`
    })
  }, [])

  console.log("images, length:", images.length)

  return (
    <>
      <h1>Gallery</h1>
      <div style={{ width: "100%", height: "90vh" }}>
        <Canvas>
          {images && images.length > 0 && (
            <GalleryContent images={images} tilesPerRow={TILES_PER_ROW} />
          )}
        </Canvas>
      </div>
    </>
  )
}
