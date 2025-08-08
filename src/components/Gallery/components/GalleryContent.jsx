import AnimatingTile from "./AnimatingTile"
import { useThree } from "@react-three/fiber"
import {
  ANIMATION_DURATION,
  MAX_RANDOM_DELAY,
  DISPLACEMENT_RATIO,
  BASE_IMAGE_SCALE,
  PERSONAL_SCALE_MULTIPLIER,
  PERSONAL_IMAGES,
} from "../constants"
import {
  computeGridMetrics,
  selectCentralIndices,
  buildDelays,
  buildTileData,
} from "../utils"

export default function GalleryContent({ imagePool, targetTilesPerRow = 5 }) {
  const { viewport } = useThree()
  if (!viewport || viewport.width === 0 || viewport.height === 0) return null

  const tilesPerRow = targetTilesPerRow
  const { idealTileWidth, tilesPerColumn, zeroX, zeroY } = computeGridMetrics({
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    tilesPerRow,
  })

  const totalTiles = Math.min(tilesPerRow * tilesPerColumn, imagePool.length)
  const images = imagePool.slice(0, totalTiles)

  const personalIndices = selectCentralIndices({
    totalTiles,
    tilesPerRow,
    tilesPerColumn,
    count: PERSONAL_IMAGES.length,
  })

  const delays = buildDelays(images.length, MAX_RANDOM_DELAY)
  const maxDelay = Math.max(...delays)
  const personalAnimationStartTime = maxDelay + ANIMATION_DURATION

  const tileData = buildTileData({
    images,
    tilesPerRow,
    idealTileWidth,
    zeroX,
    zeroY,
    displacementRatio: DISPLACEMENT_RATIO,
    delays,
    maxDelay,
    personalImages: { indices: personalIndices, urls: PERSONAL_IMAGES },
    baseImageScale: BASE_IMAGE_SCALE,
    personalScaleMultiplier: PERSONAL_SCALE_MULTIPLIER,
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
          targetScale={tile.scale}
        />
      ))}
    </group>
  )
}
