import { Canvas } from "@react-three/fiber"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import useImagePreloader from "../../hooks/useImagePreloader"
import { useMemo } from "react"
import theme from "../../theme"
import useResponsiveTilesPerRow from "../../hooks/useResponsiveTilesPerRow"
import styled from "styled-components"

import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"

const Page = styled.div`
  background-color: ${theme.colors.background.dark};
  min-height: 100vh;
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
      <Title>Gallery</Title>
      <Stage>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ touchAction: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <GalleryContent
            imagePool={imagePool}
            targetTilesPerRow={tilesPerRow}
            personalImages={personalImages}
          />
        </Canvas>
      </Stage>
    </Page>
  )
}
