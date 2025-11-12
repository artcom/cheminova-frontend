import { useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  ANIMATION_DURATION,
  BASE_IMAGE_SCALE,
  DEBUG_GALLERY,
  DISPLACEMENT_RATIO,
  MAX_RANDOM_DELAY,
  PERSONAL_SCALE_MULTIPLIER,
} from "../config"
import {
  buildDelays,
  buildTileData,
  computeGridMetrics,
  selectCentralIndices,
} from "../utils"
import AnimatingTile from "./AnimatingTile"

export default function GalleryContent({
  imagePool,
  targetTilesPerRow,
  personalImages,
  onAllAnimationsDone,
  detailMode,
  setDetailMode,
  canEnterDetail,
  activeIndex,
  setActiveIndex,
  detailStackScale,
  setDetailStackScale,
  onStackSizeChange,
  switchInfo,
  onDebugDataUpdate,
}) {
  const { viewport } = useThree()
  const vw = viewport.width
  const vh = viewport.height
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

    const responsiveBaseScale =
      vw <= 480 ? Math.min(1.2, BASE_IMAGE_SCALE) * 0.9 : BASE_IMAGE_SCALE
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

  const [detailSnapshot, setDetailSnapshot] = useState(null)

  useEffect(() => {
    const schedule = (callback) => {
      if (typeof requestAnimationFrame === "function") {
        const frameId = requestAnimationFrame(() => callback())
        return () => cancelAnimationFrame(frameId)
      }
      const timeoutId = setTimeout(() => callback(), 0)
      return () => clearTimeout(timeoutId)
    }

    if (detailMode) {
      if (detailSnapshot) return undefined
      return schedule(() =>
        setDetailSnapshot({
          tileData,
          personalStart: personalAnimationStartTime,
        }),
      )
    }

    if (!detailSnapshot) return undefined
    return schedule(() => setDetailSnapshot(null))
  }, [detailMode, tileData, personalAnimationStartTime, detailSnapshot])

  const effectiveTileData = useMemo(() => {
    if (detailMode && detailSnapshot?.tileData) {
      return detailSnapshot.tileData
    }
    return tileData
  }, [detailMode, detailSnapshot, tileData])

  const effectivePersonalStart = useMemo(() => {
    if (detailMode && detailSnapshot?.personalStart) {
      return detailSnapshot.personalStart
    }
    return personalAnimationStartTime
  }, [detailMode, detailSnapshot, personalAnimationStartTime])

  // If not yet captured, default to the first tile’s scale; once captured, keep it until exit
  const computedDefaultDetailScale = useMemo(() => {
    if (!ready || !tileData.length) return 1
    return tileData[0].scale
  }, [ready, tileData])

  const completedRef = useRef(0)
  const total = effectiveTileData.length
  useEffect(() => {
    completedRef.current = 0
  }, [total])

  const handleTileCompleted = () => {
    completedRef.current += 1
    if (completedRef.current === total && onAllAnimationsDone)
      onAllAnimationsDone()
  }

  const effectiveTileCount = effectiveTileData.length

  useEffect(() => {
    if (onStackSizeChange) {
      onStackSizeChange(effectiveTileCount)
    }
  }, [effectiveTileCount, onStackSizeChange])

  const currentPositionsRef = useRef({})

  const handlePositionUpdate = (tileIndex, position) => {
    currentPositionsRef.current[tileIndex] = position
    if (onDebugDataUpdate && effectiveTileData.length > 0) {
      const updatedTileData = effectiveTileData.map((tile, idx) => ({
        ...tile,
        currentPosition: currentPositionsRef.current[idx] || tile.position,
      }))
      onDebugDataUpdate(updatedTileData)
    }
  }

  useEffect(() => {
    if (onDebugDataUpdate && effectiveTileCount > 0) {
      const updatedTileData = effectiveTileData.map((tile, idx) => ({
        ...tile,
        currentPosition: currentPositionsRef.current[idx] || tile.position,
      }))
      onDebugDataUpdate(updatedTileData)
    }
  }, [effectiveTileData, effectiveTileCount, onDebugDataUpdate])

  return (
    <group>
      {effectiveTileData.map((tile, idx) => (
        <AnimatingTile
          key={tile.key}
          position={tile.position}
          url={tile.image}
          delay={tile.delay}
          isPersonal={tile.isPersonal}
          personalAnimationStartTime={effectivePersonalStart}
          targetScale={tile.scale}
          onCompleted={handleTileCompleted}
          onClick={() => {
            if (canEnterDetail && setDetailMode) {
              if (setActiveIndex) {
                setActiveIndex(idx)
                DEBUG_GALLERY &&
                  console.debug("[GalleryContent] enter detail idx", idx)
              }
              if (!detailStackScale && setDetailStackScale) {
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
          stackSize={effectiveTileData.length}
          activeIndex={activeIndex}
          switchInfo={switchInfo}
          onPositionUpdate={DEBUG_GALLERY ? handlePositionUpdate : undefined}
        />
      ))}
    </group>
  )
}
