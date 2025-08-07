import AnimatingTile from "./AnimatingTile"
import PersonalImage1 from "../assets/1.jpg"
import PersonalImage2 from "../assets/2.jpg"
import PersonalImage3 from "../assets/3.jpg"

const imageScale = 1
const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]
const ANIMATION_DURATION = 5.2

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

  const delays = images.map(() => Math.random() * 5.5)
  const maxDelay = Math.max(...delays)
  const personalAnimationStartTime = maxDelay + ANIMATION_DURATION

  const tileData = images.map((image, index) => {
    const row = Math.floor(index / tilesPerRow)
    const column = index % tilesPerRow
    const x = zeroX + column * imageScale
    const y = zeroY - row * imageScale
    const position = [x, y, 0]
    const personalIdx = randomIndices.indexOf(index)

    return {
      key:
        personalIdx !== -1
          ? `personal-${personalIdx}-${index}`
          : `${image}-${index}`,
      position,
      image: personalIdx !== -1 ? personalImages[personalIdx] : image,
      isPersonal: personalIdx !== -1,
      delay: delays[index],
    }
  })

  return (
    <group>
      {tileData.map((tile) => (
        <AnimatingTile
          key={tile.key}
          position={tile.position}
          url={tile.image}
          delay={tile.delay}
          isPersonal={tile.isPersonal}
          personalAnimationStartTime={personalAnimationStartTime}
        />
      ))}
    </group>
  )
}
