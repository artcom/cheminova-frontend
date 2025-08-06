import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"

export default function Gallery() {
  return (
    <>
      <h1>Gallery</h1>
      <Canvas>
        <GalleryContent />
      </Canvas>
    </>
  )
}
