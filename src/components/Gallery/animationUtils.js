import { easing } from "maath"

import animationConfig from "./config"

export const clamp01 = (v) => Math.max(0, Math.min(1, v))
export const easeOut = easing.cubic.out

export const applyTransform = (node, { scale, opacity, z }) => {
  if (scale != null) node.scale.set(scale, scale, 1)
  if (opacity != null && node.material) node.material.opacity = opacity
  if (z != null) node.position.z = z
}

export const setGrayscale = (mat, value) => {
  if (mat && mat.grayscale !== undefined) mat.grayscale = value
}

export const animatePersonal = ({
  img,
  mat,
  elapsedTime,
  adjustedStart,
  targetScale,
  targetZ,
  flags,
}) => {
  const { startScale, startOpacity, endOpacity, startZ, duration } =
    animationConfig.personal

  if (elapsedTime < adjustedStart) {
    applyTransform(img, { scale: startScale, opacity: 0, z: startZ })
    return
  }

  const t = clamp01((elapsedTime - adjustedStart) / duration)
  const k = easeOut(t)

  const scale = startScale + (targetScale - startScale) * k
  const opacity = startOpacity + (endOpacity - startOpacity) * k
  const z = startZ + (targetZ - startZ) * k

  applyTransform(img, { scale, opacity, z })
  setGrayscale(mat, 0)

  if (t >= 1) flags.initialDone.current = true
}

export const animateNormal = ({
  img,
  mat,
  elapsedTime,
  delay,
  targetScale,
  targetZ,
  grayscaleStart,
  flags,
}) => {
  const { startScale, startOpacity, endOpacity, startZ, duration } =
    animationConfig.normal
  const {
    start: gsStart,
    end: gsEnd,
    duration: gsDur,
  } = animationConfig.grayscale

  if (elapsedTime < delay) return

  const t = clamp01((elapsedTime - delay) / duration)
  const k = easeOut(t)

  const scale = startScale + (targetScale - startScale) * k
  const opacity = startOpacity + (endOpacity - startOpacity) * k
  const z = startZ + (targetZ - startZ) * k

  applyTransform(img, { scale, opacity, z })

  if (elapsedTime >= grayscaleStart) {
    const g = clamp01((elapsedTime - grayscaleStart) / gsDur)
    const kg = easeOut(g)
    const gs = gsStart + (gsEnd - gsStart) * kg
    setGrayscale(mat, gs)
    if (g >= 1) flags.grayscaleDone.current = true
  } else {
    setGrayscale(mat, gsStart)
  }

  if (t >= 1) flags.initialDone.current = true
}
