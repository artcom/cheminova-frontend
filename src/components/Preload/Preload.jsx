import { styled } from "styled-components"
import usePagePreloader from "@hooks/usePagePreloader"
import { preloadConfig } from "./preloadConfig"

const PreloadDebugOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  line-height: 1.4;
`

export default function Preload({ screenIndex, children }) {
  const {
    preloadedImageCount,
    totalImageCount,
    preloadedComponentsCount,
    upcomingPages,
    isAllImagesPreloaded,
  } = usePagePreloader(screenIndex, preloadConfig)

  if (totalImageCount > 0 || preloadedComponentsCount > 0) {
    console.log(
      `📸 Preload status: ${preloadedImageCount}/${totalImageCount} images, ${preloadedComponentsCount} components loaded for pages: ${upcomingPages.join(", ")}`,
    )
  }

  const showPreloadDebug =
    import.meta.env?.DEV &&
    (totalImageCount > 0 || preloadedComponentsCount > 0)

  const currentPageImages =
    upcomingPages.length > 0
      ? upcomingPages.reduce((acc, pageIndex) => {
          const pageConfig = preloadConfig[pageIndex]
          return acc + (pageConfig?.images?.length || 0)
        }, 0)
      : 0

  const currentPageComponents =
    upcomingPages.length > 0
      ? upcomingPages.reduce((acc, pageIndex) => {
          const pageConfig = preloadConfig[pageIndex]
          return acc + (pageConfig?.lazyComponents?.length || 0)
        }, 0)
      : 0

  return (
    <>
      {showPreloadDebug && (
        <PreloadDebugOverlay>
          📍 Page: {screenIndex} | Next: {upcomingPages.join(", ") || "none"}
          <br />
          🖼️ Images: {preloadedImageCount}/{currentPageImages}
          <br />
          🧩 Components: {preloadedComponentsCount}/{currentPageComponents}
          <br />
          {isAllImagesPreloaded ? "✅ Ready" : "⏳ Loading"}
        </PreloadDebugOverlay>
      )}
      {children}
    </>
  )
}
