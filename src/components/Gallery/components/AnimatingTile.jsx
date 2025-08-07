import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Image } from "@react-three/drei"
import { easing } from "maath"

const START_SCALE = 0.3
const START_OPACITY = 0
const END_OPACITY = 1
const ANIMATION_DURATION = 5.2

const PERSONAL_START_SCALE = 3
const PERSONAL_START_OPACITY = 0
const PERSONAL_END_OPACITY = 1
const PERSONAL_START_Z = 2
const PERSONAL_END_Z = 0
const PERSONAL_ANIMATION_DURATION = 3.5

const GRAYSCALE_ANIMATION_DURATION = 2.0
const GRAYSCALE_START = 0
const GRAYSCALE_END = 1

export default function AnimatingTile({
  url,
  position,
  delay,
  isPersonal,
  personalAnimationStartTime,
  targetScale = 1,
}) {
  const imageRef = useRef()
  const isInitialAnimationDone = useRef(false)
  const isGrayscaleAnimationDone = useRef(false)

  const grayscaleStartTime =
    personalAnimationStartTime + PERSONAL_ANIMATION_DURATION

  useFrame((state) => {
    if (!imageRef.current || !imageRef.current.material) {
      return
    }

    if (isPersonal && isInitialAnimationDone.current) {
      return
    }
    if (
      !isPersonal &&
      isInitialAnimationDone.current &&
      isGrayscaleAnimationDone.current
    ) {
      return
    }

    const { elapsedTime } = state.clock

    if (isPersonal) {
      if (elapsedTime < personalAnimationStartTime) {
        imageRef.current.material.opacity = 0
        imageRef.current.position.z = PERSONAL_START_Z
        imageRef.current.scale.set(
          PERSONAL_START_SCALE,
          PERSONAL_START_SCALE,
          1,
        )
        return
      }

      const timeSinceAnimStart = elapsedTime - personalAnimationStartTime
      let progress = timeSinceAnimStart / PERSONAL_ANIMATION_DURATION

      if (progress >= 1) {
        progress = 1
        isInitialAnimationDone.current = true
      }

      const easedProgress = easing.cubic.out(progress)

      const currentScale =
        PERSONAL_START_SCALE +
        (targetScale - PERSONAL_START_SCALE) * easedProgress
      imageRef.current.scale.set(currentScale, currentScale, 1)

      const currentOpacity =
        PERSONAL_START_OPACITY +
        (PERSONAL_END_OPACITY - PERSONAL_START_OPACITY) * easedProgress
      imageRef.current.material.opacity = currentOpacity

      const currentZ =
        PERSONAL_START_Z + (PERSONAL_END_Z - PERSONAL_START_Z) * easedProgress
      imageRef.current.position.z = currentZ

      if (imageRef.current.material.grayscale !== undefined) {
        imageRef.current.material.grayscale = 0
      }
    } else {
      if (elapsedTime < delay) {
        return
      }

      const timeSinceAnimStart = elapsedTime - delay
      let progress = timeSinceAnimStart / ANIMATION_DURATION

      if (progress >= 1) {
        progress = 1
        isInitialAnimationDone.current = true
      }

      const easedProgress = easing.cubic.out(progress)

      const currentScale =
        START_SCALE + (targetScale - START_SCALE) * easedProgress
      imageRef.current.scale.set(currentScale, currentScale, 1)

      const currentOpacity =
        START_OPACITY + (END_OPACITY - START_OPACITY) * easedProgress
      imageRef.current.material.opacity = currentOpacity

      if (elapsedTime >= grayscaleStartTime) {
        const grayscaleTimeSinceStart = elapsedTime - grayscaleStartTime
        let grayscaleProgress =
          grayscaleTimeSinceStart / GRAYSCALE_ANIMATION_DURATION

        if (grayscaleProgress >= 1) {
          grayscaleProgress = 1
          isGrayscaleAnimationDone.current = true
        }

        const easedGrayscaleProgress = easing.cubic.out(grayscaleProgress)
        const currentGrayscaleValue =
          GRAYSCALE_START +
          (GRAYSCALE_END - GRAYSCALE_START) * easedGrayscaleProgress

        if (imageRef.current.material.grayscale !== undefined) {
          imageRef.current.material.grayscale = currentGrayscaleValue
        }
      } else {
        if (imageRef.current.material.grayscale !== undefined) {
          imageRef.current.material.grayscale = 0
        }
      }
    }
  })

  const initialScale = isPersonal ? PERSONAL_START_SCALE : START_SCALE
  const initialOpacity = isPersonal ? PERSONAL_START_OPACITY : START_OPACITY
  const initialPosition = isPersonal
    ? [position[0], position[1], PERSONAL_START_Z]
    : position

  return (
    <Image
      ref={imageRef}
      url={url}
      position={initialPosition}
      scale={initialScale}
      opacity={initialOpacity}
      transparent
    />
  )
}
