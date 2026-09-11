import { findByType } from "@/experience/tree"
import { AnimatePresence, motion } from "motion/react"

import Vignette from "@ui/Vignette"

import ParallaxBackground from "./components/ParallaxBackground"
import { Layout } from "./styles"

const PARALLAX_TYPES = new Set(["welcome-language", "welcome-intro"])

export default function WelcomeLayout({ node, tree, children }) {
  const welcomeIntro = findByType(tree, "welcome-intro")
  const welcome = findByType(tree, "welcome")
  const characterOverview = findByType(tree, "welcome-character")

  const backgroundImage =
    node.type === "welcome-character" || node.type === "choose-character"
      ? characterOverview?.backgroundImage?.file
      : welcome?.backgroundImage?.file

  const showParallax = PARALLAX_TYPES.has(node.type)

  return (
    <Layout $backgroundImage={backgroundImage}>
      <AnimatePresence>
        {showParallax && <ParallaxBackground welcomeIntro={welcomeIntro} />}
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={node.id}
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
          {children}
        </motion.div>
      </AnimatePresence>
      <Vignette />
    </Layout>
  )
}
