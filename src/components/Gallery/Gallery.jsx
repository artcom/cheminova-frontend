import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import appTheme from "@providers/Theme/theme"
import { Canvas } from "@react-three/fiber"
import { AnimatePresence, motion } from "motion/react"
import { Suspense, useState } from "react"
import { styled } from "styled-components"

import Navigation from "@ui/Navigation"

import CameraController from "./components/CameraController"
import GalleryContent from "./components/GalleryContent"
import GalleryLoader from "./components/GalleryLoader"
import StackBump from "./components/StackBump"
import { CAMERA_DEFAULT_Z } from "./config"
import { useGalleryLogic } from "./useGalleryLogic"

const Page = styled.div`
  background-color: ${appTheme.colors.background.dark};
  min-height: 100vh;
  width: 100%;
`

const Title = styled.h1`
  color: ${appTheme.colors.background.paper};
  margin: 0;
  padding: 20px;
  font-size: 1.5rem;
`

const Stage = styled.div`
  width: 100%;
  height: 90vh;
  position: relative;
  overflow: hidden;
`

const DateDisplay = styled(motion.div)`
  position: absolute;
  bottom: 35%;
  left: 0;
  right: 0;
  text-align: center;
  color: ${appTheme.colors.background.paper};
  pointer-events: none;
  font-size: 1rem;
  z-index: 10;
  font-family: "Inter", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export default function Gallery() {
  const [activeTile, setActiveTile] = useState(null)

  const {
    allAnimsDone,
    setAllAnimsDone,
    detailMode,
    setDetailMode,
    activeIndex,
    setActiveIndex,
    switchInfo,
    detailStackScale,
    setDetailStackScale,
    tilesPerRow,
    galleryHeading,
    exitButtonText,
    personalImages,
    imagePoolData,
    isLoading,
    loadedCount,
    totalImages,
    handleExit,
    handlePrev,
    handleNext,
    handleStackSizeChange,
    handleStackBumpEnd,
  } = useGalleryLogic()

  // We show the loader if we are fetching data OR preloading images
  if (isLoading) {
    return (
      <Page>
        <Title>{galleryHeading}</Title>
        <GalleryLoader loadedCount={loadedCount} totalImages={totalImages} />
      </Page>
    )
  }

  return (
    <Page>
      <Title>
        {allAnimsDone && !detailMode
          ? "Click an image to explore"
          : galleryHeading}
      </Title>

      <Stage>
        <Canvas
          camera={{ position: [0, 0, CAMERA_DEFAULT_Z], fov: 75 }}
          style={{ touchAction: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <CameraController detailMode={detailMode} />

            <StackBump
              switchInfo={switchInfo}
              onEnd={handleStackBumpEnd}
              detailMode={detailMode}
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
                onStackSizeChange={handleStackSizeChange}
                switchInfo={switchInfo}
                onActiveItemChange={setActiveTile}
              />
            </StackBump>
          </Suspense>
        </Canvas>
        <AnimatePresence>
          {detailMode && (
            <>
              {activeTile?.meta?.date && (
                <DateDisplay
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {new Date(activeTile.meta.date).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </DateDisplay>
              )}
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
                  selectLabel={exitButtonText}
                  onSelect={handleExit}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </motion.div>
            </>
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
