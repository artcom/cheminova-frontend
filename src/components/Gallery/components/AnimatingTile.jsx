import { useEffect, useMemo, useRef } from "react"
import { useFrame, extend } from "@react-three/fiber"
import { Image } from "@react-three/drei"
import { geometry } from "maath"
import ANIMATION_CONFIG, {
  STACK_LERP,
  ENABLE_DECK_EFFECT,
  DECK_OFFSET_AMPLITUDE,
  DECK_ROTATION_MAX,
} from "../config"
import { animatePersonal, animateNormal } from "../animationUtils"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

export default function AnimatingTile({
  url,
  position,
  delay,
  isPersonal,
  personalAnimationStartTime,
  targetScale = 1,
  onCompleted,
  onClick,
  detailMode = false,
}) {
  const imageRef = useRef()
  const flags = {
    initialDone: useRef(false),
    grayscaleDone: useRef(false),
  }
  const completedSent = useRef(false)

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

    // If in detail mode, override XY to stack at center, preserve Z
    if (detailMode) {
      const z = img.position.z
      // target center with optional deck offset
      let tx = 0
      let ty = 0
      if (ENABLE_DECK_EFFECT) {
        // Use z to derive a small deterministic offset and tilt
        const seed = z * 31.4159
        const sx = Math.sin(seed)
        const sy = Math.cos(seed)
        tx = sx * DECK_OFFSET_AMPLITUDE
        ty = sy * DECK_OFFSET_AMPLITUDE * 0.6
        const r = sx * DECK_ROTATION_MAX
        img.rotation.z = img.rotation.z + (r - img.rotation.z) * 0.2
      }
      img.position.x = img.position.x + (tx - img.position.x) * STACK_LERP
      img.position.y = img.position.y + (ty - img.position.y) * STACK_LERP
      return
    }

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

    // Completion callback dispatch
    if (!completedSent.current) {
      const done = isPersonal
        ? flags.initialDone.current
        : flags.initialDone.current && flags.grayscaleDone.current
      if (done && onCompleted) {
        completedSent.current = true
        onCompleted()
      }
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
  const initialPosition = useMemo(
    () => [position[0], position[1], initialZ],
    // position is stable per tile; initialZ depends on isPersonal and config
    [position, initialZ],
  )

  // Set initial transforms to prevent re-render resets
  useEffect(() => {
    const img = imageRef.current
    if (!img) return
    const mat = img.material
    img.position.set(initialPosition[0], initialPosition[1], initialPosition[2])
    img.scale.set(initialScale, initialScale, 1)
    if (mat) {
      mat.transparent = true
      mat.opacity = initialOpacity
    }
  }, [initialPosition, initialScale, initialOpacity])

  return (
    <Image ref={imageRef} url={url} transparent onClick={onClick}>
      <roundedPlaneGeometry args={[1, 1, 0.08]} />
    </Image>
  )
}
