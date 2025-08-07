import AnimatingTile from "./AnimatingTile"
import PersonalImage1 from "../assets/1.jpg"
import PersonalImage2 from "../assets/2.jpg"
import PersonalImage3 from "../assets/3.jpg"
import { useThree } from "@react-three/fiber"

const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]
const ANIMATION_DURATION = 5.2

export default function GalleryContent({ imagePool, targetTilesPerRow = 5 }) {
  const { viewport } = useThree()

  if (!viewport || viewport.width === 0 || viewport.height === 0) {
    return null
  }

  const tilesPerRow = targetTilesPerRow
  const idealTileWidth = viewport.width / tilesPerRow
  const tilesPerColumn = Math.floor(viewport.height / idealTileWidth)
  const totalTiles = Math.min(tilesPerRow * tilesPerColumn, imagePool.length)
  const images = imagePool.slice(0, totalTiles)
  const imageScale = idealTileWidth * 1.0

  const gridWidth = tilesPerRow * idealTileWidth
  const gridHeight = tilesPerColumn * idealTileWidth

  const zeroX = -gridWidth / 2 + idealTileWidth / 2
  const zeroY = gridHeight / 2 - idealTileWidth / 2

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
    const x = zeroX + column * idealTileWidth
    const y = zeroY - row * idealTileWidth
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
          targetScale={imageScale}
        />
      ))}
    </group>
  )
}
