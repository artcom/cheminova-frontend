import { useEffect } from "react"
import { useMotionValue, animate } from "framer-motion"

export const useCharacterCarousel = (
  selectedIndex,
  charactersLength,
  onSelectionChange,
) => {
  const x = useMotionValue(0)
  const spacing = window.innerWidth

  useEffect(() => {
    animate(x, -spacing * (selectedIndex - 1), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }, [selectedIndex, spacing, x])

  const handleDragEnd = () => {
    const currentPosition = x.get()
    const calculatedIndex = -currentPosition / spacing + 1
    const newIndex = Math.round(calculatedIndex)
    const clampedIndex = Math.min(Math.max(newIndex, 0), charactersLength - 1)

    if (clampedIndex !== selectedIndex) {
      onSelectionChange(clampedIndex)
    }

    animate(x, -(clampedIndex - 1) * spacing, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }

  const dragConstraints = {
    left: -(charactersLength - 2) * spacing,
    right: spacing,
  }

  return {
    x,
    spacing,
    handleDragEnd,
    dragConstraints,
  }
}
