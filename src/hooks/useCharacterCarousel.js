import { animate, useMotionValue } from "motion/react"
import { useEffect, useState } from "react"

export const useCharacterCarousel = (
  selectedIndex,
  charactersLength,
  onSelectionChange,
) => {
  const x = useMotionValue(0)
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

  const handleDragEnd = () => {
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
