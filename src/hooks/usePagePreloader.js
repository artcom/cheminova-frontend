import { useEffect } from "react"
import useImagePreloader from "./useImagePreloader"
import useContentPreloader from "./useContentPreloader"

/**
 * Custom hook for preloading content for upcoming pages/screens
 * @param {number} currentIndex - Current page/screen index
 * @param {object} preloadConfig - Configuration for what to preload for each page
 * @param {number} lookAhead - How many pages ahead to preload (default: 1)
 * @returns {object} - Preload status and utilities
 */
const usePagePreloader = (currentIndex, preloadConfig = {}, lookAhead = 1) => {
  // Determine which pages to preload
  const upcomingPages = []
  for (let i = 1; i <= lookAhead; i++) {
    const nextIndex = currentIndex + i
    if (preloadConfig[nextIndex]) {
      upcomingPages.push(nextIndex)
    }
  }

  // Collect all images that need to be preloaded
  const imagesToPreload = upcomingPages.reduce((acc, pageIndex) => {
    const pageConfig = preloadConfig[pageIndex]
    if (pageConfig?.images) {
      return [...acc, ...pageConfig.images]
    }
    return acc
  }, [])

  // Collect all lazy components and custom preloaders
  const contentConfig = upcomingPages.reduce((acc, pageIndex) => {
    const pageConfig = preloadConfig[pageIndex]
    if (pageConfig?.lazyComponents) {
      acc.lazyComponents = [
        ...(acc.lazyComponents || []),
        ...pageConfig.lazyComponents,
      ]
    }
    if (pageConfig?.customPreloaders) {
      acc.customPreloaders = [
        ...(acc.customPreloaders || []),
        ...pageConfig.customPreloaders,
      ]
    }
    return acc
  }, {})

  // Use image preloader for the collected images
  const { isPreloaded, preloadedCount, totalCount } = useImagePreloader(
    imagesToPreload,
    imagesToPreload.length > 0,
  )

  // Use content preloader for lazy components and custom preloaders
  const { isComponentPreloaded, preloadedComponentsCount } =
    useContentPreloader(contentConfig, Object.keys(contentConfig).length > 0)

  // Execute any custom preload functions (legacy support)
  useEffect(() => {
    upcomingPages.forEach((pageIndex) => {
      const pageConfig = preloadConfig[pageIndex]
      if (
        pageConfig?.preloadFunction &&
        typeof pageConfig.preloadFunction === "function"
      ) {
        try {
          pageConfig.preloadFunction()
        } catch (error) {
          console.warn(
            `Failed to execute preload function for page ${pageIndex}:`,
            error,
          )
        }
      }
    })
  }, [upcomingPages])

  return {
    isImagePreloaded: isPreloaded,
    isComponentPreloaded,
    preloadedImageCount: preloadedCount,
    totalImageCount: totalCount,
    preloadedComponentsCount,
    upcomingPages,
    isAllImagesPreloaded: totalCount > 0 && preloadedCount === totalCount,
  }
}

export default usePagePreloader
