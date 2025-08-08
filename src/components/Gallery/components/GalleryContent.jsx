import { useEffect, useMemo, useRef } from "react"
import AnimatingTile from "./AnimatingTile"
import { useThree } from "@react-three/fiber"
import {
  ANIMATION_DURATION,
  MAX_RANDOM_DELAY,
  DISPLACEMENT_RATIO,
  BASE_IMAGE_SCALE,
  PERSONAL_SCALE_MULTIPLIER,
} from "../config"
import {
  computeGridMetrics,
  selectCentralIndices,
  buildDelays,
  buildTileData,
} from "../utils"

export default function GalleryContent({
  imagePool,
  targetTilesPerRow = 5,
  personalImages = [],
  onAllAnimationsDone,
  detailMode = false,
  setDetailMode,
  canEnterDetail = false,
}) {
  const { viewport } = useThree()
  const vw = viewport?.width || 0
  const vh = viewport?.height || 0
  const ready = vw > 0 && vh > 0

  const { tileData, personalAnimationStartTime } = useMemo(() => {
    if (!ready) return { tileData: [], personalAnimationStartTime: 0 }

    const tilesPerRow = targetTilesPerRow
    const { idealTileWidth, tilesPerColumn, zeroX, zeroY } = computeGridMetrics(
      {
        viewportWidth: vw,
        viewportHeight: vh,
        tilesPerRow,
      },
    )

    const totalTiles = Math.min(tilesPerRow * tilesPerColumn, imagePool.length)
    const images = imagePool.slice(0, totalTiles)

    const personalIndices = selectCentralIndices({
      totalTiles,
      tilesPerRow,
      tilesPerColumn,
      count: personalImages.length,
      seed: totalTiles * 31 + tilesPerRow * 17 + tilesPerColumn * 13,
    })

    const delays = buildDelays(
      images.length,
      MAX_RANDOM_DELAY,
      totalTiles * 97 + tilesPerRow * 71 + tilesPerColumn * 53,
    )
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
      personalImages: { indices: personalIndices, urls: personalImages },
      baseImageScale: BASE_IMAGE_SCALE,
      personalScaleMultiplier: PERSONAL_SCALE_MULTIPLIER,
      seed: totalTiles * 7 + tilesPerRow * 11 + tilesPerColumn * 19,
    })

    return { tileData, personalAnimationStartTime }
  }, [ready, vw, vh, targetTilesPerRow, imagePool, personalImages])

  // Completion tracking
  const completedRef = useRef(0)
  const total = tileData.length
  useEffect(() => {
    completedRef.current = 0
  }, [total])

  const handleTileCompleted = () => {
    completedRef.current += 1
    if (completedRef.current === total && onAllAnimationsDone)
      onAllAnimationsDone()
  }

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
          onCompleted={handleTileCompleted}
          onClick={() => canEnterDetail && setDetailMode && setDetailMode(true)}
          detailMode={detailMode}
          canEnterDetail={canEnterDetail}
        />
      ))}
    </group>
  )
}
