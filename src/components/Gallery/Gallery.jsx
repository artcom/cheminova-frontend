import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import useImagePreloader from "../../hooks/useImagePreloader"
import { useMemo } from "react"

import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"

const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

const cologneImages = import.meta.glob("./CologneCathedral/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
})

export default function Gallery() {
  const imagePool = useMemo(() => {
    return Object.values(cologneImages)
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
