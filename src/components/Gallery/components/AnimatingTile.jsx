import {
  animateNormal,
  animatePersonal,
} from "@components/Gallery/animationUtils"
import animationConfig, {
  CAMERA_DEFAULT_Z,
  DEBUG_GALLERY,
  DEBUG_THROTTLE_MS,
  DECK_OFFSET_AMPLITUDE,
  DECK_ROTATION_MAX,
  DETAIL_ACTIVE_LIFT,
  DETAIL_CAMERA_Z,
  ENABLE_DECK_EFFECT,
  RESTORE_LERP,
  SCALE_COMP_MAX,
  SCALE_COMP_MIN,
  STACK_ASSEMBLY_DUR,
  STACK_FADE_LERP,
  STACK_LERP,
  STACK_SWITCH_DUR,
  WRAP_EXTRA_DEPTH,
  WRAP_ROTATION,
} from "@components/Gallery/config"
import { Image } from "@react-three/drei"
import { extend, useFrame, useThree } from "@react-three/fiber"
import { geometry } from "maath"
import { useEffect, useMemo, useRef } from "react"
import { Vector3 } from "three"

extend({ RoundedPlaneGeometry: geometry.RoundedPlaneGeometry })

const ANIMATION_CONFIG = animationConfig

const mulberry32 = (seed) => {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const SAFE_POSITION = [0, 0, 0]

const computePersonalDelay = (isPersonal, url, position) => {
  if (!isPersonal) return 0

  const coords = Array.isArray(position) ? position : SAFE_POSITION
  const seedSource = typeof url === "string" && url.length > 0 ? url : "tile"
  const seedString = `${seedSource}-${coords.join("-")}`
  let hash = 0
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0
  }
  const rand = mulberry32(hash)()
  return rand * ANIMATION_CONFIG.personal.delayMax
}

export default function AnimatingTile({
  url,
  position,
  delay,
  isPersonal,
  personalAnimationStartTime,
  targetScale,
  onCompleted,
  onClick,
  detailMode,
  detailStackScale,
  isActive,
  stackIndex,
  stackSize,
  activeIndex,
  switchInfo,
}) {
  const { camera, size } = useThree()
  const safePosition = Array.isArray(position) ? position : SAFE_POSITION
  const safeUrl = typeof url === "string" ? url : ""

  const imageRef = useRef()
  const originalZRef = useRef(safePosition[2])
  const deckSeedRef = useRef(safePosition[2])
  const baseScaleRef = useRef(targetScale)
  const lastLogMsRef = useRef(0)
  const switchRef = useRef({ dir: 0, startMs: 0 })
  const tunedMatRef = useRef(false)
  const lastActiveLogRef = useRef(0)
  const tmpVecRef = useRef(new Vector3())
  const detailEnterMsRef = useRef(0)
  const initialDoneRef = useRef(false)
  const grayscaleDoneRef = useRef(false)

  useEffect(() => {
    switchRef.current = switchInfo || { dir: 0, startMs: 0 }
  }, [switchInfo])
  const flags = useMemo(
    () => ({
      initialDone: initialDoneRef,
      grayscaleDone: grayscaleDoneRef,
    }),
    [],
  )
  const completedSent = useRef(false)

  const targetZ = safePosition[2]
  const personalDelay = useMemo(
    () => computePersonalDelay(isPersonal, safeUrl, safePosition),
    [isPersonal, safeUrl, safePosition],
  )
  const adjustedPersonalStartTime = personalAnimationStartTime + personalDelay
  const grayscaleStartTime =
    personalAnimationStartTime +
    ANIMATION_CONFIG.personal.delayMax +
    ANIMATION_CONFIG.personal.duration

  useFrame((state) => {
    const img = imageRef.current
    const mat = img?.material
    if (!img || !mat) return

    if (detailMode) {
      if (!tunedMatRef.current) {
        mat.transparent = true
        mat.depthWrite = false
        mat.depthTest = false
        if (typeof mat.opacity !== "number") mat.opacity = 1
        tunedMatRef.current = true
      }
      let assemblyK = 1
      if (detailEnterMsRef.current) {
        const elapsed = (performance.now() - detailEnterMsRef.current) / 1000
        assemblyK = Math.min(1, Math.max(0, elapsed / STACK_ASSEMBLY_DUR))
        if (typeof mat.opacity === "number") {
          mat.opacity = mat.opacity + (1 - mat.opacity) * STACK_FADE_LERP
        }
      }
      const originalZ = originalZRef.current
      let tx = 0
      let ty = 0
      if (ENABLE_DECK_EFFECT) {
        const seed = (deckSeedRef.current ?? originalZ) * 31.4159
        const sx = Math.sin(seed)
        const sy = Math.cos(seed)
        tx = sx * DECK_OFFSET_AMPLITUDE * assemblyK
        ty = sy * DECK_OFFSET_AMPLITUDE * 0.6 * assemblyK
        const r = sx * DECK_ROTATION_MAX
        img.rotation.z = img.rotation.z + (r - img.rotation.z) * 0.12
      }
      let depthOffset = 0
      let sideOffset = 0
      let relativeDistance = 0
      let shortest = 0

      let effectiveActiveTransform = activeIndex
      let effectiveActiveRender = activeIndex
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
        const prevActive =
          (((activeIndex - sw.dir) % stackSize) + stackSize) % stackSize
        if (switchProgress < 0.5) {
          effectiveActiveTransform = prevActive
        }
        effectiveActiveRender = activeIndex
      }
      if (
        typeof stackIndex === "number" &&
        typeof stackSize === "number" &&
        stackSize > 0 &&
        typeof activeIndex === "number"
      ) {
        const raw = stackIndex - effectiveActiveTransform
        const half = Math.floor(stackSize / 2)
        shortest = raw
        if (raw > half) shortest = raw - stackSize
        else if (raw < -half) shortest = raw + stackSize

        const diff = Math.abs(shortest)
        const capped = Math.min(diff, 6)
        depthOffset = Math.max(-0.12, -0.02 * capped)
        sideOffset = 0
        relativeDistance = diff

        if (sw && sw.dir && sw.startMs) {
          const dir = sw.dir
          const progress = switchProgress
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
      const isEffectiveActive =
        detailMode &&
        typeof stackIndex === "number" &&
        typeof stackSize === "number" &&
        stackSize > 0 &&
        typeof activeIndex === "number"
          ? stackIndex === effectiveActiveRender
          : isActive
      const ringPos =
        typeof stackSize === "number" && stackSize > 0
          ? (stackIndex - effectiveActiveRender + stackSize) % stackSize
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

      const baseScale = detailStackScale || baseScaleRef.current
      const camZ = camera.position.z
      const lift = DETAIL_ACTIVE_LIFT * (DETAIL_CAMERA_Z / CAMERA_DEFAULT_Z)
      const focusZTarget =
        originalZ + (isEffectiveActive ? lift : 0.0) + depthOffset
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

      if (DEBUG_GALLERY && isActive) {
        const now = performance.now()
        if (now - lastActiveLogRef.current > 200) {
          const dist = camera.position.distanceTo(img.position)
          const ndc = tmpVecRef.current.copy(img.position)
          ndc.project(camera)
          const sx = ((ndc.x + 1) / 2) * size.width
          const sy = ((-ndc.y + 1) / 2) * size.height
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
            opacity: mat.opacity.toFixed(2),
            dist: dist.toFixed(2),
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

    if (!detailMode) {
      img.position.x =
        img.position.x + (safePosition[0] - img.position.x) * RESTORE_LERP
      img.position.y =
        img.position.y + (safePosition[1] - img.position.y) * RESTORE_LERP
      mat.depthWrite = true
      mat.depthTest = true
      mat.transparent = true
    }

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
    () => [safePosition[0], safePosition[1], initialZ],
    [safePosition, initialZ],
  )

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
    originalZRef.current = safePosition[2]
    deckSeedRef.current = safePosition[2]
    if (!detailMode) {
      baseScaleRef.current = targetScale
    }
    tunedMatRef.current = false
  }, [
    initialPosition,
    initialScale,
    initialOpacity,
    safePosition,
    targetScale,
    detailMode,
  ])

  useEffect(() => {
    if (detailMode) {
      detailEnterMsRef.current = performance.now()
      originalZRef.current = 0
    } else {
      detailEnterMsRef.current = 0
    }
  }, [detailMode])

  return (
    <Image
      ref={imageRef}
      url={safeUrl}
      transparent
      frustumCulled={false}
      onClick={onClick}
    >
      <roundedPlaneGeometry args={[1, 1, 0.08]} />
    </Image>
  )
}
