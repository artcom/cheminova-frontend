// Moved from src/hooks/useCharacterCarousel.js
import { animate, useMotionValue } from "motion/react"
import { useEffect, useRef, useState } from "react"

export const useCharacterCarousel = (
  selectedIndex,
  charactersLength,
  onSelectionChange,
) => {
  const x = useMotionValue(0)
  const lastDragX = useRef(0)
  const dragStartX = useRef(0)
  const dragStartTime = useRef(0)
  const [spacing, setSpacing] = useState(0)

  useEffect(() => {
    const updateSpacing = () => {
      const viewportWidth =
        document.documentElement.clientWidth || window.innerWidth
      setSpacing(viewportWidth)
    }

    setTimeout(updateSpacing, 100)

    window.addEventListener("resize", updateSpacing)
    window.addEventListener("orientationchange", updateSpacing)

    return () => {
      window.removeEventListener("resize", updateSpacing)
      window.removeEventListener("orientationchange", updateSpacing)
    }
  }, [])

  useEffect(() => {
    const targetPosition = -spacing * selectedIndex
    animate(x, targetPosition, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }, [selectedIndex, spacing, x])

  const MIN_DRAG_RATIO = 0.3 // fraction of spacing (reduced for sensitivity)
  const MIN_VELOCITY_PX_MS = 0.3 // swipe speed threshold

  const handleDragStart = () => {
    dragStartX.current = x.get()
    lastDragX.current = dragStartX.current
    dragStartTime.current = performance.now()
  }

  const handleDragEnd = () => {
    const endX = x.get()
    const delta = endX - dragStartX.current
    const durationMs = Math.max(performance.now() - dragStartTime.current, 1)
    const velocity = delta / durationMs // px per ms

    let targetIndex = selectedIndex
    const dragThreshold = spacing * MIN_DRAG_RATIO

    if (spacing > 0) {
      if (delta < -dragThreshold || velocity < -MIN_VELOCITY_PX_MS) {
        // swipe left -> next (clamp at upper bound)
        targetIndex = Math.min(selectedIndex + 1, charactersLength - 1)
      } else if (delta > dragThreshold || velocity > MIN_VELOCITY_PX_MS) {
        // swipe right -> prev (clamp at lower bound)
        targetIndex = Math.max(selectedIndex - 1, 0)
      } else {
        // fallback to nearest index without wrapping
        const calculatedIndex = Math.round(-endX / spacing)
        targetIndex = Math.min(
          Math.max(calculatedIndex, 0),
          charactersLength - 1,
        )
      }
    }

    if (targetIndex !== selectedIndex) {
      onSelectionChange(targetIndex)
    }

    animate(x, -targetIndex * spacing, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }

  // Disable hard constraints to allow continuity in perception; still limit visually via snapping
  const dragConstraints = false

  return {
    x,
    spacing,
    handleDragStart,
    handleDragEnd,
    dragConstraints,
  }
}
