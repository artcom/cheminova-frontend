import { getNextRoute } from "@/characterRoutesConfig"
import useCapturedImages from "@/hooks/useCapturedImages"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"
import { DEBUG_GALLERY } from "./config"
import { buildGalleryImagePool, getPersistedPersonalImages } from "./helpers"
import { useGalleryImages } from "./useGalleryImages"
import useImagePreloader from "./useImagePreloader"
import useResponsiveTilesPerRow from "./useResponsiveTilesPerRow"

const defaultPersonalImages = [PersonalImage1, PersonalImage2, PersonalImage3]

export function useGalleryLogic() {
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

  const { data: galleryImages = [], isLoading: galleryLoading } =
    useGalleryImages()

  const galleryHeading = gallery?.heading || t("gallery.title")
  const exitButtonText = gallery?.exitButtonText || t("gallery.exitGallery")

  const personalImages = useMemo(
    () => getPersistedPersonalImages(defaultPersonalImages, capturedImages),
    [capturedImages],
  )

  const imagePoolData = useMemo(
    () => buildGalleryImagePool(galleryImages),
    [galleryImages],
  )

  const allImages = useMemo(
    () => [...imagePoolData.combined, ...personalImages],
    [imagePoolData.combined, personalImages],
  )

  const {
    isLoading: preloaderLoading,
    loadedCount,
    totalImages,
  } = useImagePreloader(allImages)

  const isLoading = preloaderLoading || galleryLoading

  const handleExit = () => {
    DEBUG_GALLERY && console.debug("[Gallery] exit detail")
    const nextRoute = getNextRoute(characterSlug, "gallery")
    navigate(`/characters/${characterSlug}/${nextRoute}`)
  }

  const handlePrev = () => {
    if (stackSize <= 0) return
    DEBUG_GALLERY && console.debug("[Gallery] prev", { stackSize, activeIndex })
    setSwitchInfo({ dir: -1, startMs: performance.now() })
    setActiveIndex((i) => (i - 1 + stackSize) % stackSize)
  }

  const handleNext = () => {
    if (stackSize <= 0) return
    DEBUG_GALLERY && console.debug("[Gallery] next", { stackSize, activeIndex })
    setSwitchInfo({ dir: 1, startMs: performance.now() })
    setActiveIndex((i) => (i + 1) % stackSize)
  }

  const handleStackSizeChange = (n) => {
    if (n !== stackSize) {
      DEBUG_GALLERY && console.debug("[Gallery] stack size", n)
      setStackSize(n)
    }
  }

  const handleStackBumpEnd = () => {
    DEBUG_GALLERY && console.debug("[StackBump] end")
    setSwitchInfo((prev) => (prev.dir ? { dir: 0, startMs: 0 } : prev))
  }

  return {
    // State
    allAnimsDone,
    setAllAnimsDone,
    detailMode,
    setDetailMode,
    activeIndex,
    setActiveIndex,
    stackSize,
    setStackSize,
    switchInfo,
    setSwitchInfo,
    detailStackScale,
    setDetailStackScale,
    tilesPerRow,

    // Data
    galleryHeading,
    exitButtonText,
    personalImages,
    imagePoolData,
    isLoading,
    loadedCount,
    totalImages,
    characterSlug,

    // Handlers
    handleExit,
    handlePrev,
    handleNext,
    handleStackSizeChange,
    handleStackBumpEnd,
  }
}
