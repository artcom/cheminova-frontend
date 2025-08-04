import { useEffect, useState } from "react"
import { animate, useMotionValue } from "motion/react"

export const useCharacterCarousel = (
  selectedIndex,
  charactersLength,
  onSelectionChange,
) => {
  const x = useMotionValue(0)
  const [spacing, setSpacing] = useState(0)

  useEffect(() => {
    const updateSpacing = () => {
      // Use document.documentElement.clientWidth for more reliable viewport width
      const viewportWidth =
        document.documentElement.clientWidth || window.innerWidth
      setSpacing(viewportWidth)
    }

    // Initial setup with a small delay to ensure DOM is ready
    setTimeout(updateSpacing, 100)

    window.addEventListener("resize", updateSpacing)
    window.addEventListener("orientationchange", updateSpacing)

    return () => {
      window.removeEventListener("resize", updateSpacing)
      window.removeEventListener("orientationchange", updateSpacing)
    }
  }, [])

  useEffect(() => {
    if (spacing > 0) {
      // Position to center the selected character
      const targetPosition = -spacing * selectedIndex
      animate(x, targetPosition, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      })
    }
  }, [selectedIndex, spacing, x])

  const handleDragEnd = () => {
    if (spacing === 0) return

    const currentPosition = x.get()
    const calculatedIndex = Math.round(-currentPosition / spacing)
    const clampedIndex = Math.min(
      Math.max(calculatedIndex, 0),
      charactersLength - 1,
    )

    if (clampedIndex !== selectedIndex) {
      onSelectionChange(clampedIndex)
    }

    animate(x, -clampedIndex * spacing, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }

  const dragConstraints = {
    left: -(charactersLength - 1) * spacing,
    right: 0,
  }

  return {
    x,
    spacing,
    handleDragEnd,
    dragConstraints,
  }
}
