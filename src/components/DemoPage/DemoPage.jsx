import { useState, Suspense, lazy } from "react"
import { AnimatePresence, motion } from "framer-motion"
import IconButton from "@ui/IconButton"
import MainLayout from "@ui/MainLayout"
import useFullscreen from "@hooks/useFullscreen"
import LaNau from "../UI/LaNau.webp"

const LazyCharacterShowcase = lazy(
  () => import("@components/CharacterShowcase"),
)

export default function DemoPage() {
  const [screenIndex, setScreenIndex] = useState(0)
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

  const handleCharacterSelected = () => {
    setScreenIndex(2) // Go to page 3 (index 2)
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
        <Suspense fallback={<div>Loading experience…</div>}>
          <LazyCharacterShowcase
            onCharacterSelected={handleCharacterSelected}
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
  ]

  const nextScreen = () =>
    setScreenIndex((i) => (i + 1) % mainLayoutScreens.length)
  const prevScreen = () =>
    setScreenIndex(
      (i) => (i - 1 + mainLayoutScreens.length) % mainLayoutScreens.length,
    )

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
      <AnimatePresence>
        <motion.div
          key={screenIndex}
          initial={{ opacity: screenIndex === 0 ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <MainLayout
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
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
