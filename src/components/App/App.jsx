import { useState, Suspense, lazy } from "react"
import IconButton from "@ui/IconButton"
import MainLayout from "@ui/MainLayout"
import useFullscreen from "@hooks/useFullscreen"
import usePagePreloader from "@hooks/usePagePreloader"
import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"
import LaNau from "@ui/assets/LaNau.webp"

const LazyCharacterShowcase = lazy(
  () => import("@components/CharacterShowcase"),
)
const LazyPhotoCapture = lazy(() => import("@components/PhotoCapture"))

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0)
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

  const preloadConfig = {
    1: {
      images: CHARACTER_DATA.map((character) => character.image),
      lazyComponents: [
        {
          name: "CharacterShowcase",
          importFunction: () => import("@components/CharacterShowcase"),
        },
        {
          name: "TransitionWrapper",
          importFunction: () =>
            import(
              "@components/CharacterShowcase/components/TransitionWrapper"
            ),
        },
        {
          name: "IntroScreen",
          importFunction: () =>
            import("@components/CharacterShowcase/components/IntroScreen"),
        },
        {
          name: "CharacterCarousel",
          importFunction: () =>
            import(
              "@components/CharacterShowcase/components/CharacterCarousel"
            ),
        },
      ],
      preloadFunction: () => {
        console.log("🚀 Preloading character showcase content...")
      },
    },
    4: {
      images: [],
      lazyComponents: [
        {
          name: "PhotoCapture",
          importFunction: () => import("@components/PhotoCapture"),
        },
      ],
      preloadFunction: () => {
        console.log("🚀 Preloading photo capture content...")
      },
    },
  }

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

  const mainLayoutScreens = [
    {
      headline: "La Nau",
      subheadline: "Experiencing",
      descriptionTitle: "Welcome to Camp Nou",
      descriptionText:
        "Discover the magic of FC Barcelona's legendary stadium through immersive experiences.",
      backgroundImage: LaNau,
      vignetteIntensity: 30,
      navigationMode: "single",
      singleButtonVariant: "arrowDown",
    },
    {
      fullscreenComponent: (
        <Suspense fallback={<div>Loading Character Showcase...</div>}>
          <LazyCharacterShowcase
            onCharacterSelected={() => setScreenIndex(2)}
          />
        </Suspense>
      ),
    },
    {
      headline: "Character Selected!",
      subheadline: "Your journey begins",
      descriptionTitle: "Welcome to your adventure",
      descriptionText:
        "You have successfully selected your character. Your personalized experience awaits!",
      vignetteIntensity: 20,
      backgroundImage: LaNau,
      navigationMode: "dual",
    },
    {
      headline: "Ready to Explore",
      subheadline: "The adventure continues",
      descriptionTitle: "Discover Camp Nou",
      descriptionText:
        "Step into the world of FC Barcelona and explore every corner of this iconic stadium. Your personalized journey through history awaits.",
      vignetteIntensity: 25,
      backgroundImage: LaNau,
      navigationMode: "dual",
    },
    {
      fullscreenComponent: (
        <Suspense fallback={<div>Loading Photo Capture...</div>}>
          <LazyPhotoCapture />
        </Suspense>
      ),
    },
  ]

  const nextScreen = () =>
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  const prevScreen = () =>
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )

  const showPreloadDebug =
    import.meta.env?.DEV &&
    (totalImageCount > 0 || preloadedComponentsCount > 0)

  // Calculate current page preload status
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
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "black",
        position: "relative",
      }}
    >
      {showPreloadDebug && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "monospace",
            lineHeight: "1.4",
          }}
        >
          � Page: {screenIndex} | Next: {upcomingPages.join(", ") || "none"}
          <br />
          🖼️ Images: {preloadedImageCount}/{currentPageImages}
          <br />
          🧩 Components: {preloadedComponentsCount}/{currentPageComponents}
          <br />
          {isAllImagesPreloaded ? "✅ Ready" : "⏳ Loading"}
        </div>
      )}

      <MainLayout
        key={screenIndex}
        {...mainLayoutScreens[screenIndex]}
        onPrev={prevScreen}
        onNext={nextScreen}
        topRightAction={
          !isIOSDevice ? (
            <IconButton
              variant="fullscreen"
              onClick={toggleFullscreen}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 10,
              }}
            />
          ) : null
        }
      />
    </div>
  )
}
