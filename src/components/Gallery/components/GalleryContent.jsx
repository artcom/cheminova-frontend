import { Image } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import SpecialTile from "./SpecialTile"

const images = [
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
  "https://images.unsplash.com/photo-1534081333815-ae5019106622",
  "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6",
  "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
  "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
]
const imageScale = 1

export default function GalleryContent() {
  const { viewport } = useThree()

  const tilesPerRow = Math.floor(viewport.width / imageScale)
  const rowWidth = tilesPerRow * imageScale

  const zeroX = -rowWidth / 2 + imageScale / 2
  const zeroY = viewport.height / 2 - imageScale / 2

  return (
    <>
      {images.map((image, index) => {
        const row = Math.floor(index / tilesPerRow)
        const column = index % tilesPerRow

        const x = zeroX + column * imageScale
        const y = zeroY - row * imageScale
        const position = [x, y, 0]

        return index % 3 === 0 ? (
          <SpecialTile
            key={index}
            position={position}
            scale={[imageScale, imageScale]}
          />
        ) : (
          <Image
            key={index}
            url={image}
            position={position}
            scale={imageScale}
          />
        )
      })}
      )
    </>
  )
}
