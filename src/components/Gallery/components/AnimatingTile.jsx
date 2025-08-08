import { useEffect, useMemo, useRef } from "react"
import { Vector3 } from "three"
import { useFrame, extend, useThree } from "@react-three/fiber"
import { Image } from "@react-three/drei"
import { geometry } from "maath"
import ANIMATION_CONFIG, {
  STACK_LERP,
  ENABLE_DECK_EFFECT,
  DECK_OFFSET_AMPLITUDE,
  DECK_ROTATION_MAX,
  STACK_SWITCH_DUR,
  WRAP_EXTRA_DEPTH,
  WRAP_ROTATION,
  DEBUG_GALLERY,
  DEBUG_THROTTLE_MS,
  CAMERA_DEFAULT_Z,
  DETAIL_CAMERA_Z,
  DETAIL_ACTIVE_LIFT,
  SCALE_COMP_MIN,
  SCALE_COMP_MAX,
  RESTORE_LERP,
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
  detailStackScale,
  isActive = false,
  stackIndex,
  stackSize,
  activeIndex,
  switchInfo,
}) {
  const { camera, size } = useThree()
  const imageRef = useRef()
  const originalZRef = useRef(position[2])
  const baseScaleRef = useRef(targetScale)
  const lastLogMsRef = useRef(0)
  const switchRef = useRef({ dir: 0, startMs: 0 })
  const tunedMatRef = useRef(false)
  const lastActiveLogRef = useRef(0)
  const tmpVecRef = useRef(new Vector3())

  // Keep latest switch info in a ref for useFrame
  useEffect(() => {
    switchRef.current = switchInfo || { dir: 0, startMs: 0 }
  }, [switchInfo])
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
      // Ensure proper depth handling when stacking to avoid disappearing due to blending
      if (!tunedMatRef.current) {
        // In detail mode we stack many planes at (nearly) the same depth.
        // Let renderOrder control visibility and disable depth writes/tests
        // to prevent z-fighting or occlusion causing the stack to disappear.
        mat.transparent = true
        mat.depthWrite = false
        mat.depthTest = false
        mat.opacity = 1
        tunedMatRef.current = true
      }
      const originalZ = originalZRef.current
      // target center with optional deck offset
      let tx = 0
      let ty = 0
      if (ENABLE_DECK_EFFECT) {
        // Use z to derive a small deterministic offset and tilt
        const seed = originalZ * 31.4159
        const sx = Math.sin(seed)
        const sy = Math.cos(seed)
        tx = sx * DECK_OFFSET_AMPLITUDE
        ty = sy * DECK_OFFSET_AMPLITUDE * 0.6
        const r = sx * DECK_ROTATION_MAX
        // damp rotation to avoid accumulating drift
        img.rotation.z = img.rotation.z + (r - img.rotation.z) * 0.12
      }
      // gentle layering based on index relative to active
      let depthOffset = 0
      let sideOffset = 0
      let relativeDistance = 0
      let shortest = 0

      // During a switch, freeze the "visual active" until halfway to avoid janky jump
      let effectiveActive = activeIndex
      let switchProgress = 1
      const sw = switchRef.current
      if (
        typeof stackSize === "number" &&
        stackSize > 0 &&
        sw &&
        sw.dir &&
        sw.startMs
      ) {
        const elapsed = (performance.now() - sw.startMs) / 1000
        switchProgress = Math.min(1, Math.max(0, elapsed / STACK_SWITCH_DUR))
        if (switchProgress < 0.5) {
          // keep previous active until mid animation
          const prevActive =
            (((activeIndex - sw.dir) % stackSize) + stackSize) % stackSize
          effectiveActive = prevActive
        }
      }
      if (
        typeof stackIndex === "number" &&
        typeof stackSize === "number" &&
        stackSize > 0 &&
        typeof activeIndex === "number"
      ) {
        // compute shortest circular distance
        const raw = stackIndex - effectiveActive
        const half = Math.floor(stackSize / 2)
        shortest = raw
        if (raw > half) shortest = raw - stackSize
        else if (raw < -half) shortest = raw + stackSize

        const diff = Math.abs(shortest)
        const capped = Math.min(diff, 6)
        depthOffset = Math.max(-0.12, -0.02 * capped)
        sideOffset = 0 // keep stack centered; only outgoing card gets side/rot animation
        relativeDistance = diff

        // During a switch, the outgoing top card should wrap underneath
        if (sw && sw.dir && sw.startMs) {
          const dir = sw.dir
          const progress = switchProgress
          if (progress >= 1) {
            // switch ended; parent will clear dir/startMs
          }
          const outgoingIndex =
            (((activeIndex - dir) % stackSize) + stackSize) % stackSize
          const isOutgoing = stackIndex === outgoingIndex
          if (isOutgoing) {
            const k = Math.sin(Math.PI * progress)
            depthOffset += WRAP_EXTRA_DEPTH * k
            const extraRot = dir * WRAP_ROTATION * k
            img.rotation.z = img.rotation.z + (extraRot - img.rotation.z) * 0.2
            if (DEBUG_GALLERY) {
              const now = performance.now()
              if (now - lastLogMsRef.current > DEBUG_THROTTLE_MS) {
                console.debug("[Tile] wrapping", {
                  stackIndex,
                  activeIndex,
                  dir,
                  progress: progress.toFixed(2),
                })
                lastLogMsRef.current = now
              }
            }
          }
        }
      }
      // Render order for stable stacking: ensure uniqueness and active on top
      const isEffectiveActive =
        detailMode &&
        typeof stackIndex === "number" &&
        typeof stackSize === "number" &&
        stackSize > 0 &&
        typeof activeIndex === "number"
          ? stackIndex === effectiveActive
          : isActive
      const ringPos =
        typeof stackSize === "number" && stackSize > 0
          ? (stackIndex - effectiveActive + stackSize) % stackSize
          : 0
      img.renderOrder =
        10000 +
        (isEffectiveActive ? 10000 : 0) +
        (stackSize ? (stackSize - relativeDistance) * 100 : 0) +
        (shortest >= 0 ? 50 : 0) +
        ringPos
      img.position.x =
        img.position.x + (tx + sideOffset - img.position.x) * STACK_LERP
      img.position.y = img.position.y + (ty - img.position.y) * STACK_LERP

      // Active image gets a gentle lift and focus scale
      // Use a uniform scale for detail stack to avoid size shifts across tiles
      const baseScale = detailStackScale || baseScaleRef.current
      const camZ = camera?.position?.z ?? CAMERA_DEFAULT_Z
      // Use a stable lift scaled by the configured DETAIL_CAMERA_Z relative to default
      const lift = DETAIL_ACTIVE_LIFT * (DETAIL_CAMERA_Z / CAMERA_DEFAULT_Z)
      const focusZTarget =
        originalZ + (isEffectiveActive ? lift : 0.0) + depthOffset
      // Scale compensation to keep on-screen size roughly stable when z changes
      const denom = Math.max(0.001, camZ - focusZTarget)
      const numer = Math.max(0.001, camZ - img.position.z)
      let comp = numer / denom
      comp = Math.max(SCALE_COMP_MIN, Math.min(SCALE_COMP_MAX, comp))
      const focusScaleTarget = isEffectiveActive
        ? baseScale * 1.08 * comp
        : baseScale
      img.scale.x = img.scale.x + (focusScaleTarget - img.scale.x) * 0.18
      img.scale.y = img.scale.y + (focusScaleTarget - img.scale.y) * 0.18
      img.position.z = img.position.z + (focusZTarget - img.position.z) * 0.18

      // Debug active tile's transform to trace disappearing issues
      if (DEBUG_GALLERY && isActive) {
        const now = performance.now()
        if (now - lastActiveLogRef.current > 200) {
          const dist = camera ? camera.position.distanceTo(img.position) : 0
          const ndc = tmpVecRef.current.copy(img.position)
          if (camera && ndc.project) ndc.project(camera)
          const sx = size?.width ? ((ndc.x + 1) / 2) * size.width : 0
          const sy = size?.height ? ((-ndc.y + 1) / 2) * size.height : 0
          console.debug("[Tile] active pose", {
            stackIndex,
            pos: {
              x: img.position.x.toFixed(2),
              y: img.position.y.toFixed(2),
              z: img.position.z.toFixed(2),
            },
            scale: img.scale.x.toFixed(2),
            renderOrder: img.renderOrder,
            rotZ: img.rotation.z.toFixed(3),
            opacity: mat.opacity?.toFixed?.(2) ?? mat.opacity,
            dist: dist ? dist.toFixed(2) : undefined,
            screen: { x: Math.round(sx), y: Math.round(sy) },
          })
          lastActiveLogRef.current = now
        }
      }
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

    // When not in detail mode, smoothly restore XY back to grid position
    if (!detailMode) {
      img.position.x =
        img.position.x + (position[0] - img.position.x) * RESTORE_LERP
      img.position.y =
        img.position.y + (position[1] - img.position.y) * RESTORE_LERP
      // restore material depth behavior for regular rendering
      mat.depthWrite = true
      mat.depthTest = true
      mat.transparent = true
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
    originalZRef.current = position[2]
    baseScaleRef.current = targetScale
    tunedMatRef.current = false
  }, [initialPosition, initialScale, initialOpacity, position, targetScale])

  return (
    <Image
      ref={imageRef}
      url={url}
      transparent
      frustumCulled={false}
      onClick={onClick}
    >
      <roundedPlaneGeometry args={[1, 1, 0.08]} />
    </Image>
  )
}
