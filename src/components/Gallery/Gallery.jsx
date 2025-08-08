import { Canvas, useThree, useFrame } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import useImagePreloader from "../../hooks/useImagePreloader"
import { useEffect, useMemo, useState, useRef } from "react"
import theme from "../../theme"
import useResponsiveTilesPerRow from "../../hooks/useResponsiveTilesPerRow"
import styled from "styled-components"
import {
  CAMERA_DEFAULT_Z,
  DETAIL_CAMERA_Z,
  CAMERA_LERP,
  STACK_SWITCH_DUR,
  STACK_BUMP_AMPLITUDE,
  DEBUG_GALLERY,
} from "./config"
import Navigation from "@ui/Navigation"
import { AnimatePresence, motion } from "framer-motion"

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

  // Load personal images from localStorage if present
  const personalImages = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("personalImages") || "[]")
      if (Array.isArray(stored) && stored.some(Boolean)) {
        // Keep only valid URLs, fill missing with defaults
        const merged = defaultPersonalImages.map((d, i) => stored[i] || d)
        return merged
      }
    } catch {
      // ignore storage parse failures
    }
    return defaultPersonalImages
  }, [])

  const imagePool = useMemo(() => {
    const entries = Object.entries(cologneImages)
    entries.sort(([a], [b]) => a.localeCompare(b))
    return entries.map(([, url]) => url)
  }, [])

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
            />
          </StackBump>
        </Canvas>

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

function CameraController({ detailMode }) {
  const { camera } = useThree()
  const lastCamLogRef = useRef(0)
  // Ensure default Z when not in detail mode
  useEffect(() => {
    if (!detailMode) {
      camera.position.set(
        camera.position.x,
        camera.position.y,
        CAMERA_DEFAULT_Z,
      )
    }
  }, [detailMode, camera])

  // Only animate camera when in detail mode
  useFrame(() => {
    if (!detailMode) return
    const dz = DETAIL_CAMERA_Z - camera.position.z
    if (Math.abs(dz) < 0.001) return
    camera.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z + dz * CAMERA_LERP,
    )
    if (DEBUG_GALLERY) {
      const now = performance.now()
      if (now - lastCamLogRef.current > 500) {
        console.debug("[Camera] pos", {
          x: camera.position.x.toFixed(2),
          y: camera.position.y.toFixed(2),
          z: camera.position.z.toFixed(2),
        })
        lastCamLogRef.current = now
      }
    }
  })
  return null
}

function StackBump({ switchDir, switchStartRef, children, onEnd }) {
  const groupRef = useRef()
  const endCalledForStartRef = useRef(0)
  // Drive timer and bump easing per frame
  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    if (!switchDir || !switchStartRef.current) {
      // settle back
      g.position.y = g.position.y + (0 - g.position.y) * 0.3
      return
    }
    // Simple up-then-down bump: y = amp * sin(pi * progress)
    const now = performance.now()
    const elapsed = (now - switchStartRef.current) / 1000
    const progress = Math.min(1, Math.max(0, elapsed / STACK_SWITCH_DUR))
    const bump = Math.sin(Math.PI * progress) * STACK_BUMP_AMPLITUDE
    g.position.y = g.position.y + (bump - g.position.y) * 0.3
    if (
      DEBUG_GALLERY &&
      (progress === 0 || progress === 1 || Math.abs(progress - 0.5) < 0.02)
    ) {
      console.debug(
        "[StackBump] progress",
        progress.toFixed(2),
        "bump",
        bump.toFixed(3),
      )
    }
    if (progress >= 1 && onEnd) {
      if (endCalledForStartRef.current !== switchStartRef.current) {
        endCalledForStartRef.current = switchStartRef.current
        onEnd()
      }
    }
  })
  return <group ref={groupRef}>{children}</group>
}
