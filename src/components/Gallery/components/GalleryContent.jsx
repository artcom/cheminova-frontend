import { Image } from "@react-three/drei"
import SpecialTile from "./SpecialTile"
import PersonalImage1 from "../assets/1.jpg"
import PersonalImage2 from "../assets/2.jpg"
import PersonalImage3 from "../assets/3.jpg"

const imageScale = 1
const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

export default function GalleryContent({ images, tilesPerRow }) {
  const TILES_PER_COLUMN = Math.ceil(images.length / tilesPerRow)
  const gridWidth = tilesPerRow * imageScale
  const gridHeight = TILES_PER_COLUMN * imageScale

  const zeroX = -gridWidth / 2 + imageScale / 2
  const zeroY = gridHeight / 2 - imageScale / 2

  const gridIndices = Array.from({ length: images.length }, (_, i) => i)
  const randomIndices = []
  while (randomIndices.length < personalImages.length && gridIndices.length) {
    const idx = Math.floor(Math.random() * gridIndices.length)
    randomIndices.push(gridIndices[idx])
    gridIndices.splice(idx, 1)
  }

  console.log("randomIndices", randomIndices)

  return (
    <group>
      {images.map((image, index) => {
        const row = Math.floor(index / tilesPerRow)
        const column = index % tilesPerRow
        const x = zeroX + column * imageScale
        const y = zeroY - row * imageScale
        const position = [x, y, 0]

        const personalIdx = randomIndices.indexOf(index)
        if (personalIdx !== -1) {
          return (
            <SpecialTile
              key={`personal-${personalIdx}-${index}`}
              position={position}
              scale={[imageScale, imageScale]}
              image={personalImages[personalIdx]}
            />
          )
        }
        return (
          <Image
            key={`${image}-${index}`}
            url={image}
            position={position}
            scale={imageScale}
          />
        )
      })}
    </group>
  )
}
