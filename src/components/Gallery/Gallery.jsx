import { extractFromContentTree } from "@/api/hooks"
import useCapturedImages from "@/hooks/useCapturedImages"
import { useGalleryImages } from "@/hooks/useGallery"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import { Canvas } from "@react-three/fiber"
import appTheme from "@theme"
import { AnimatePresence, motion } from "motion/react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"
import { styled } from "styled-components"

import Navigation from "@ui/Navigation"

import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"
import CameraController from "./components/CameraController"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import StackBump from "./components/StackBump"
import { CAMERA_DEFAULT_Z, DEBUG_GALLERY } from "./config"
import { buildCombinedImagePool, getPersistedPersonalImages } from "./helpers"
import useImagePreloader from "./hooks/useImagePreloader"
import useResponsiveTilesPerRow from "./hooks/useResponsiveTilesPerRow"

const Page = styled.div`
  background-color: ${appTheme.colors.background.dark};
  min-height: 100vh;
  width: 100%;
`

const Title = styled.h1`
  color: ${appTheme.colors.background.paper};
  margin: 0;
  padding: 20px;
`

const Stage = styled.div`
  width: 100%;
  height: 90vh;
  position: relative;
  overflow: hidden;
`

const ExitButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid #333;
  padding: 10px 15px;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  z-index: 50;
`

const defaultPersonalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

const cologneImages = import.meta.glob("./CologneCathedral/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
})

export default function Gallery() {
  const { t } = useTranslation()
  const { capturedImages = [] } = useCapturedImages()
  const tilesPerRow = useResponsiveTilesPerRow()
  const [allAnimsDone, setAllAnimsDone] = useState(false)
  const [detailMode, setDetailMode] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stackSize, setStackSize] = useState(0)
  const [switchInfo, setSwitchInfo] = useState({ dir: 0, startMs: 0 })
  const [detailStackScale, setDetailStackScale] = useState(null)
  const navigate = useNavigate()
  const { characterSlug, gallery } = useLoaderData()

  const { data: galleryData, isLoading: galleryLoading } = useGalleryImages()

  const galleryHeading = gallery?.heading || t("gallery.title")
  const exitButtonText = gallery?.exitButtonText || t("gallery.exitGallery")
  const closeButtonText = gallery?.closeButtonText || t("gallery.close")

  const personalImages = useMemo(
    () => getPersistedPersonalImages(defaultPersonalImages, capturedImages),
    [capturedImages],
  )

  const imagePoolData = useMemo(() => {
    const uploadedImages = galleryData?.images || []
    return buildCombinedImagePool(cologneImages, uploadedImages)
  }, [galleryData?.images])

  const allImages = useMemo(
    () => [...imagePoolData.combined, ...personalImages],
    [imagePoolData.combined, personalImages],
  )

  const { isLoading, loadedCount, totalImages } = useImagePreloader(allImages)

  const isFullyLoading = isLoading || galleryLoading

  const handleExitGallery = () => {
    navigate("/")
  }

  if (isFullyLoading) {
    return (
      <Page>
        <Title>{galleryHeading}</Title>
        <ExitButton onClick={handleExitGallery}>{exitButtonText}</ExitButton>
        <GalleryLoader loadedCount={loadedCount} totalImages={totalImages} />
      </Page>
    )
  }

  return (
    <Page>
      <Title>
        {allAnimsDone && !detailMode ? galleryHeading : `${galleryHeading}`}
      </Title>
      <ExitButton
        onClick={() => navigate(`/characters/${characterSlug}/ending`)}
      >
        {exitButtonText}
      </ExitButton>
      <Stage>
        <Canvas
          camera={{ position: [0, 0, CAMERA_DEFAULT_Z], fov: 75 }}
          style={{ touchAction: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <CameraController detailMode={detailMode} />

          <StackBump
            switchInfo={switchInfo}
            onEnd={() => {
              DEBUG_GALLERY && console.debug("[StackBump] end")
              setSwitchInfo((prev) =>
                prev.dir ? { dir: 0, startMs: 0 } : prev,
              )
            }}
          >
            <GalleryContent
              imagePool={imagePoolData.combined}
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
                n !== stackSize &&
                  DEBUG_GALLERY &&
                  console.debug("[Gallery] stack size", n)
                setStackSize(n)
              }}
              switchInfo={switchInfo}
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
                selectLabel={closeButtonText}
                onSelect={() => {
                  DEBUG_GALLERY && console.debug("[Gallery] exit detail")
                  setDetailMode(false)
                  setDetailStackScale(null)
                }}
                onPrev={() => {
                  if (stackSize <= 0) return
                  DEBUG_GALLERY &&
                    console.debug("[Gallery] prev", { stackSize, activeIndex })
                  setSwitchInfo({ dir: -1, startMs: performance.now() })
                  setActiveIndex((i) => (i - 1 + stackSize) % stackSize)
                }}
                onNext={() => {
                  if (stackSize <= 0) return
                  DEBUG_GALLERY &&
                    console.debug("[Gallery] next", { stackSize, activeIndex })
                  setSwitchInfo({ dir: 1, startMs: performance.now() })
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

export const clientLoader = async ({ params }) => {
  const {
    section: gallery,
    characterSlug,
    characterIndex,
  } = await loadCharacterSection(
    params,
    (content, characterIndex) =>
      extractFromContentTree.getGallery(content, characterIndex),
    { missingMessage: "Gallery data missing from CMS" },
  )

  return { characterIndex, characterSlug, gallery }
}
