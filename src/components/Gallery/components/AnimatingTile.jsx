import { useRef } from "react"
import { useFrame, extend } from "@react-three/fiber"
import { Image } from "@react-three/drei"
import { geometry } from "maath"
import ANIMATION_CONFIG from "../config"
import { animatePersonal, animateNormal } from "../animationUtils"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function AnimatingTile({
  url,
  position,
  delay,
  isPersonal,
  personalAnimationStartTime,
  targetScale = 1,
}) {
  const imageRef = useRef()
  const flags = {
    initialDone: useRef(false),
    grayscaleDone: useRef(false),
  }

  const targetZ = position[2]
  const personalDelay = useRef(
    isPersonal ? Math.random() * ANIMATION_CONFIG.personal.delayMax : 0,
  )
  const adjustedPersonalStartTime =
    personalAnimationStartTime + personalDelay.current
  const grayscaleStartTime =
    personalAnimationStartTime +
    ANIMATION_CONFIG.personal.delayMax +
    ANIMATION_CONFIG.personal.duration

  useFrame((state) => {
    const img = imageRef.current
    const mat = img?.material
    if (!img || !mat) return

    if (isPersonal && flags.initialDone.current) return
    if (!isPersonal && flags.initialDone.current && flags.grayscaleDone.current)
      return

    const { elapsedTime } = state.clock

    if (isPersonal) {
      animatePersonal({
        img,
        mat,
        elapsedTime,
        adjustedStart: adjustedPersonalStartTime,
        targetScale,
        targetZ,
        flags,
      })
    } else {
      animateNormal({
        img,
        mat,
        elapsedTime,
        delay,
        targetScale,
        targetZ,
        grayscaleStart: grayscaleStartTime,
        flags,
      })
    }
  })

  const initialScale = isPersonal
    ? ANIMATION_CONFIG.personal.startScale
    : ANIMATION_CONFIG.normal.startScale
  const initialOpacity = isPersonal
    ? ANIMATION_CONFIG.personal.startOpacity
    : ANIMATION_CONFIG.normal.startOpacity
  const initialZ = isPersonal
    ? ANIMATION_CONFIG.personal.startZ
    : ANIMATION_CONFIG.normal.startZ
  const initialPosition = [position[0], position[1], initialZ]

  return (
    <Image
      ref={imageRef}
      url={url}
      position={initialPosition}
      scale={initialScale}
      opacity={initialOpacity}
      transparent
    >
      <roundedPlaneGeometry args={[1, 1, 0.08]} />
    </Image>
  )
}
