import { motion } from "motion/react"

import { LayerImage, LayersContainer } from "../styles"

const MotionLayerImage = motion.create(LayerImage)

export default function ParallaxBackground({ welcomeIntro }) {
  const PARALLAX_LAYERS = [
    {
      id: "third",
      src: welcomeIntro?.backgroundImageLayer3?.file,
      initial: { x: "-60%", y: 100, scale: 0.95, opacity: 0 },
      animate: { x: "-110%", y: -20, scale: 1, opacity: 0.9 },
      exit: { x: "-140%", y: -20, scale: 1.1, opacity: 0 },
      transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }, // Cubic bezier for smooth ease-out
    },
    {
      id: "second",
      src: welcomeIntro?.backgroundImageLayer2?.file,
      initial: { x: "-45%", y: 150, scale: 0.95, opacity: 0 },
      animate: { x: "-50%", y: 130, scale: 1, opacity: 0.9 },
      exit: { x: "-45%", y: 120, scale: 1.2, opacity: 0 },
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 },
    },
    {
      id: "front",
      src: welcomeIntro?.backgroundImageLayer1?.file,
      initial: { x: "-0%", y: 400, scale: 0.9, opacity: 0 },
      animate: { x: "-50%", y: 200, scale: 1, opacity: 0.5 },
      exit: { x: "-50%", y: -100, scale: 1.1, opacity: 0 },
      transition: { duration: 1.0, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 },
    },
  ]

  return (
    <LayersContainer key="intro-layers">
      {PARALLAX_LAYERS.map((layer) => (
        <MotionLayerImage
          key={layer.id}
          src={layer.src}
          alt=""
          initial={layer.initial}
          animate={layer.animate}
          exit={layer.exit}
          transition={layer.transition}
        />
      ))}
    </LayersContainer>
  )
}
