import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import { useMemo } from "react"

const imagePixelSize = 300

const getRandomHexColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")
}

export default function Gallery() {
  const imagePool = useMemo(() => {
    console.log("Generating image pool... (This will run only once)")
    return Array.from({ length: 100 }, () => {
      const bgColor = getRandomHexColor()
      const textColor = "FFFFFF"
      const text = `${imagePixelSize}x${imagePixelSize}`
      return `https://placehold.co/${imagePixelSize}x${imagePixelSize}/${bgColor}/${textColor}?text=${text}`
    })
  }, [])

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
