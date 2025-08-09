import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import useImagePreloader from "../../hooks/useImagePreloader"
import { useMemo, useState, useRef } from "react"
import theme from "../../theme"
import useResponsiveTilesPerRow from "../../hooks/useResponsiveTilesPerRow"
import styled from "styled-components"
import { CAMERA_DEFAULT_Z, DEBUG_GALLERY } from "./config"
import Navigation from "@ui/Navigation"
import { AnimatePresence, motion } from "framer-motion"
import CameraController from "./components/CameraController"
import StackBump from "./components/StackBump"
import { getPersistedPersonalImages, buildImagePoolFromGlob } from "./helpers"

import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"

const Page = styled.div`
  background-color: ${theme.colors.background.dark};
  min-height: 100vh;
  width: 100%;
`

const Title = styled.h1`
  color: ${theme.colors.background.paper};
  margin: 0;
  padding: 20px;
`

const Stage = styled.div`
  width: 100%;
  height: 90vh;
  position: relative;
  overflow: hidden;
`

const DebugOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 100;
  min-width: 300px;
`

const DebugControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 101;
`

const DebugButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid #333;
  padding: 5px 10px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`

const defaultPersonalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

const cologneImages = import.meta.glob("./CologneCathedral/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
})

export default function Gallery() {
  const tilesPerRow = useResponsiveTilesPerRow()
  const [allAnimsDone, setAllAnimsDone] = useState(false)
  const [detailMode, setDetailMode] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stackSize, setStackSize] = useState(0)
  const [switchDir, setSwitchDir] = useState(0) // 1 next, -1 prev, 0 idle
  const switchStartRef = useRef(0) // performance.now() timestamp
  const [detailStackScale, setDetailStackScale] = useState(null)
  const [showDebugOverlay, setShowDebugOverlay] = useState(false)
  const [tileDebugData, setTileDebugData] = useState([])

  // Load personal images from localStorage if present
  const personalImages = useMemo(
    () => getPersistedPersonalImages(defaultPersonalImages),
    [],
  )

  const imagePool = useMemo(() => buildImagePoolFromGlob(cologneImages), [])

  const allImages = useMemo(() => {
    return [...imagePool, ...personalImages]
  }, [imagePool, personalImages])

  const { isLoading, loadedCount, totalImages } = useImagePreloader(allImages)

  if (isLoading) {
    return (
      <Page>
        <Title>Gallery</Title>
        <GalleryLoader loadedCount={loadedCount} totalImages={totalImages} />
      </Page>
    )
  }

  return (
    <Page>
      <Title>
        {allAnimsDone && !detailMode ? "Click an image" : "Gallery"}
      </Title>
      <Stage>
        <Canvas
          camera={{ position: [0, 0, CAMERA_DEFAULT_Z], fov: 75 }}
          style={{ touchAction: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <CameraController detailMode={detailMode} />

          <StackBump
            switchDir={switchDir}
            switchStartRef={switchStartRef}
            onEnd={() => {
              if (DEBUG_GALLERY) console.debug("[StackBump] end")
              setSwitchDir(0)
              switchStartRef.current = 0
            }}
          >
            <GalleryContent
              imagePool={imagePool}
              targetTilesPerRow={tilesPerRow}
              personalImages={personalImages}
              onAllAnimationsDone={() => setAllAnimsDone(true)}
              detailMode={detailMode}
              setDetailMode={setDetailMode}
              canEnterDetail={allAnimsDone && !detailMode}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              detailStackScale={detailStackScale}
              setDetailStackScale={setDetailStackScale}
              onStackSizeChange={(n) => {
                if (n !== stackSize && DEBUG_GALLERY)
                  console.debug("[Gallery] stack size", n)
                setStackSize(n)
              }}
              switchInfo={{ dir: switchDir, startMs: switchStartRef.current }}
              onDebugDataUpdate={DEBUG_GALLERY ? setTileDebugData : undefined}
            />
          </StackBump>
        </Canvas>

        {DEBUG_GALLERY && (
          <>
            <DebugControls>
              <DebugButton
                onClick={() => setShowDebugOverlay(!showDebugOverlay)}
              >
                {showDebugOverlay ? "Hide Debug" : "Show Debug"}
              </DebugButton>
              <DebugButton
                onClick={() => {
                  console.group("🎯 Gallery Position Debug Data")
                  console.log("Gallery State:", {
                    detailMode,
                    activeIndex,
                    stackSize,
                    tilesPerRow,
                    totalTiles: tileDebugData.length,
                  })
                  console.log("Tile Positions:")
                  tileDebugData.forEach((tile, idx) => {
                    console.log(
                      `Tile ${idx}${tile.isPersonal ? " (Personal)" : ""}:`,
                      {
                        targetPosition: tile.position,
                        currentPositionX: tile.currentPosition
                          ? tile.currentPosition[0]
                          : tile.position[0],
                        currentPositionY: tile.currentPosition
                          ? tile.currentPosition[1]
                          : tile.position[1],
                        currentPositionZ: tile.currentPosition
                          ? tile.currentPosition[2]
                          : tile.position[2],
                        scale: tile.scale,
                        delay: tile.delay,
                        isActive: idx === activeIndex && detailMode,
                      },
                    )
                  })
                  console.groupEnd()
                }}
              >
                Log Positions
              </DebugButton>
            </DebugControls>

            {showDebugOverlay && (
              <DebugOverlay>
                <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                  Gallery Debug Info ({tileDebugData.length} tiles)
                </div>
                <div style={{ marginBottom: "10px" }}>
                  Detail Mode: {detailMode ? "ON" : "OFF"} | Active Index:{" "}
                  {activeIndex} | Stack Size: {stackSize}
                </div>
                {tileDebugData.map((tile, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "8px",
                      padding: "5px",
                      backgroundColor:
                        idx === activeIndex && detailMode
                          ? "rgba(255, 255, 0, 0.2)"
                          : "transparent",
                      border: tile.isPersonal
                        ? "1px solid #ff6b6b"
                        : "1px solid #333",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: tile.isPersonal ? "#ff6b6b" : "#4ecdc4",
                      }}
                    >
                      Tile {idx} {tile.isPersonal ? "(Personal)" : ""}
                    </div>
                    <div>
                      Position: [{tile.position[0].toFixed(3)},{" "}
                      {tile.position[1].toFixed(3)},{" "}
                      {tile.position[2].toFixed(3)}]
                    </div>
                    <div>Scale: {tile.scale.toFixed(3)}</div>
                    <div>Delay: {tile.delay.toFixed(2)}s</div>
                    {tile.currentPosition && (
                      <div style={{ color: "#90ee90" }}>
                        Current: [{tile.currentPosition[0].toFixed(3)},{" "}
                        {tile.currentPosition[1].toFixed(3)},{" "}
                        {tile.currentPosition[2].toFixed(3)}]
                      </div>
                    )}
                  </div>
                ))}
              </DebugOverlay>
            )}
          </>
        )}

        <AnimatePresence>
          {detailMode && (
            <motion.div
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 20,
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <Navigation
                mode="select"
                position="bottom"
                selectLabel="Close"
                onSelect={() => {
                  if (DEBUG_GALLERY) console.debug("[Gallery] exit detail")
                  setDetailMode(false)
                  setDetailStackScale(null)
                }}
                onPrev={() => {
                  if (stackSize <= 0) return
                  if (DEBUG_GALLERY)
                    console.debug("[Gallery] prev", { stackSize, activeIndex })
                  setSwitchDir(-1)
                  switchStartRef.current = performance.now()
                  setActiveIndex((i) => (i - 1 + stackSize) % stackSize)
                }}
                onNext={() => {
                  if (stackSize <= 0) return
                  if (DEBUG_GALLERY)
                    console.debug("[Gallery] next", { stackSize, activeIndex })
                  setSwitchDir(1)
                  switchStartRef.current = performance.now()
                  setActiveIndex((i) => (i + 1) % stackSize)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>
    </Page>
  )
}
