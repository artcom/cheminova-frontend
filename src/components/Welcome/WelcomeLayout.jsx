import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCmsContent } from "@/utils/loaderHelpers"
import { preloadImages } from "@/utils/preloadImages"
import { AnimatePresence, motion } from "motion/react"
import { useLoaderData, useLocation, useOutlet } from "react-router-dom"

import Vignette from "@ui/Vignette"

import ParallaxBackground from "./components/ParallaxBackground"
import { Layout } from "./styles"

export default function WelcomeLayout() {
  const data = useLoaderData()
  const { welcomeIntro, welcome, characterOverview } = data
  const location = useLocation()
  const outlet = useOutlet(data)

  // Determine background image based on current path
  let backgroundImage = welcome?.backgroundImage?.file

  if (location.pathname.includes("/context")) {
    backgroundImage = welcome?.backgroundImage?.file
  } else if (
    location.pathname.includes("/onboarding") ||
    location.pathname.includes("/characters")
  ) {
    backgroundImage = characterOverview?.backgroundImage?.file
  }

  // Show parallax only on root and intro routes
  const showParallax =
    location.pathname === "/" || location.pathname === "/intro"

  return (
    <Layout $backgroundImage={backgroundImage}>
      <AnimatePresence>
        {showParallax && <ParallaxBackground welcomeIntro={welcomeIntro} />}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
      <Vignette />
    </Layout>
  )
}

export const id = "welcome"

export const clientLoader = async () => {
  const { content, locale } = await loadCmsContent()

  const welcomeLanguage = extractFromContentTree.getWelcomeLanguage(content)
  const welcomeIntro = extractFromContentTree.getWelcomeIntro(content)
  const welcome = extractFromContentTree.getWelcome(content)
  const characterOverview = extractFromContentTree.getCharacterOverview(content)
  const characters = extractFromContentTree.getCharacters(content)

  // Collect all layer images from CMS
  const layerImages = [
    welcomeIntro?.backgroundImageLayer1?.file,
    welcomeIntro?.backgroundImageLayer2?.file,
    welcomeIntro?.backgroundImageLayer3?.file,
  ].filter(Boolean)

  // Collect all background images
  const backgroundImages = [
    welcomeIntro?.backgroundImage?.file,
    welcome?.backgroundImage?.file,
    characterOverview?.backgroundImage?.file,
  ].filter(Boolean)

  // Preload all images in parallel
  await Promise.all([
    preloadImages(layerImages),
    preloadImages(backgroundImages),
  ])

  return {
    welcomeLanguage,
    welcomeIntro,
    welcome,
    characterOverview,
    characters,
    locale,
  }
}
