import { useEffect, useMemo, useRef } from "react"
import AnimatingTile from "./AnimatingTile"
import { useThree } from "@react-three/fiber"
import {
  ANIMATION_DURATION,
  MAX_RANDOM_DELAY,
  DISPLACEMENT_RATIO,
  BASE_IMAGE_SCALE,
  PERSONAL_SCALE_MULTIPLIER,
  DEBUG_GALLERY,
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
  activeIndex = 0,
  setActiveIndex,
  detailStackScale,
  setDetailStackScale,
  onStackSizeChange,
  switchInfo,
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

    // On small screens, reduce base scale slightly so 5 columns fit without overlap
    const responsiveBaseScale =
      vw <= 480 ? Math.min(1.0, BASE_IMAGE_SCALE) * 0.9 : BASE_IMAGE_SCALE
    const responsivePersonalMultiplier =
      vw <= 480
        ? Math.min(1.2, PERSONAL_SCALE_MULTIPLIER)
        : PERSONAL_SCALE_MULTIPLIER

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
      baseImageScale: responsiveBaseScale,
      personalScaleMultiplier: responsivePersonalMultiplier,
      seed: totalTiles * 7 + tilesPerRow * 11 + tilesPerColumn * 19,
    })

    return {
      tileData,
      personalAnimationStartTime,
      responsiveBaseScale,
      idealTileWidth,
    }
  }, [ready, vw, vh, targetTilesPerRow, imagePool, personalImages])

  // If not yet captured, default to the first tile’s scale; once captured, keep it until exit
  const computedDefaultDetailScale = useMemo(() => {
    if (!ready || !tileData.length) return 1
    return tileData[0]?.scale || 1
  }, [ready, tileData])

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

  useEffect(() => {
    if (onStackSizeChange) onStackSizeChange(tileData.length)
  }, [tileData.length, onStackSizeChange])

  return (
    <group>
      {tileData.map((tile, idx) => (
        <AnimatingTile
          key={tile.key}
          position={tile.position}
          url={tile.image}
          delay={tile.delay}
          isPersonal={tile.isPersonal}
          personalAnimationStartTime={personalAnimationStartTime}
          targetScale={tile.scale}
          onCompleted={handleTileCompleted}
          onClick={() => {
            if (canEnterDetail && setDetailMode) {
              if (setActiveIndex) {
                setActiveIndex(idx)
                if (DEBUG_GALLERY)
                  console.debug("[GalleryContent] enter detail idx", idx)
              }
              if (!detailStackScale && setDetailStackScale) {
                // Capture the scale of the clicked tile to preserve perceived size
                setDetailStackScale(tile.scale)
              }
              setDetailMode(true)
            }
          }}
          detailMode={detailMode}
          canEnterDetail={canEnterDetail}
          detailStackScale={detailStackScale || computedDefaultDetailScale}
          isActive={detailMode && idx === activeIndex}
          stackIndex={idx}
          stackSize={tileData.length}
          activeIndex={activeIndex}
          switchInfo={switchInfo}
        />
      ))}
    </group>
  )
}
