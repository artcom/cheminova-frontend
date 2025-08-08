import { Canvas, useThree, useFrame } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import useImagePreloader from "../../hooks/useImagePreloader"
import { useEffect, useMemo, useState } from "react"
import theme from "../../theme"
import useResponsiveTilesPerRow from "../../hooks/useResponsiveTilesPerRow"
import styled from "styled-components"
import { CAMERA_DEFAULT_Z, DETAIL_CAMERA_Z, CAMERA_LERP } from "./config"

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

const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

const cologneImages = import.meta.glob("./CologneCathedral/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
})

export default function Gallery() {
  const tilesPerRow = useResponsiveTilesPerRow()
  const [allAnimsDone, setAllAnimsDone] = useState(false)
  const [detailMode, setDetailMode] = useState(false)

  const imagePool = useMemo(() => {
    const entries = Object.entries(cologneImages)
    entries.sort(([a], [b]) => a.localeCompare(b))
    return entries.map(([, url]) => url)
  }, [])

  const allImages = useMemo(() => {
    return [...imagePool, ...personalImages]
  }, [imagePool])

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
          <GalleryContent
            imagePool={imagePool}
            targetTilesPerRow={tilesPerRow}
            personalImages={personalImages}
            onAllAnimationsDone={() => setAllAnimsDone(true)}
            detailMode={detailMode}
            setDetailMode={setDetailMode}
            canEnterDetail={allAnimsDone && !detailMode}
          />
        </Canvas>
      </Stage>
    </Page>
  )
}

function CameraController({ detailMode }) {
  const { camera } = useThree()
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
    camera.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z + (DETAIL_CAMERA_Z - camera.position.z) * CAMERA_LERP,
    )
  })
  return null
}
