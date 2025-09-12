export const calculateCharacterTransform = (
  index,
  selectedIndex,
  spacing,
  overlapFactor = 0.4,
) => {
  const offset = index - selectedIndex
  const absoluteOffset = Math.abs(offset)

  return {
    scale: Math.max(1 - absoluteOffset * 0.2, 0.8),
    z: -absoluteOffset * 100,
    y: -absoluteOffset * 20,
    xOffset: offset === 0 ? 0 : -offset * spacing * overlapFactor,
    shadowIntensity: absoluteOffset,
  }
}

export const CAROUSEL_ANIMATION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  duration: 0.5,
}

export const DRAG_CONFIG = {
  elastic: 0.2,
  momentum: false,
}
