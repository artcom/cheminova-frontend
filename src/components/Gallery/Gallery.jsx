import { Canvas } from "@react-three/fiber"
import { Image, OrbitControls } from "@react-three/drei"

export default function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6",
  ]

  return (
    <>
      <h1>Gallery</h1>
      <Canvas>
        <OrbitControls />
        {images.map((img, index) => (
          <Image key={index} url={img} position={[index, 0, 0]} />
        ))}
      </Canvas>
    </>
  )
}
