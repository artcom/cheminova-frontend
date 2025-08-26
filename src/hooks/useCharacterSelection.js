import {
  CHARACTER_DATA,
  DRAG_THRESHOLD,
} from "@components/CharacterShowcase/constants"
import { useEffect, useState } from "react"

export const useCharacterSelection = () => {
  const [selectedCharIndex, setSelectedCharIndex] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragConstraints, setDragConstraints] = useState({
    left: -200,
    right: 200,
  })

  useEffect(() => {
    const updateDragConstraints = () => {
      const width = window.innerWidth
      const constraints =
        width > 768
          ? { left: -300, right: 300 }
          : width > 480
            ? { left: -250, right: 250 }
            : { left: -150, right: 150 }

      setDragConstraints(constraints)
    }

    updateDragConstraints()
    window.addEventListener("resize", updateDragConstraints)
    return () => window.removeEventListener("resize", updateDragConstraints)
  }, [])

  const handlePrevious = () => {
    setSelectedCharIndex(selectedCharIndex - 1)
    setDragOffset(0)
    return selectedCharIndex > 0
  }

  const handleNext = () => {
    setSelectedCharIndex(selectedCharIndex + 1)
    setDragOffset(0)
    return selectedCharIndex < CHARACTER_DATA.length - 1
  }

  const handleDrag = (_, info) => {
    setIsDragging(true)
    setDragOffset(info.offset.x)
  }

  const handleDragEnd = (_, info) => {
    setIsDragging(false)

    if (
      info.offset.x < -DRAG_THRESHOLD &&
      selectedCharIndex < CHARACTER_DATA.length - 1
    ) {
      handleNext()
    } else if (info.offset.x > DRAG_THRESHOLD && selectedCharIndex > 0) {
      handlePrevious()
    }

    setDragOffset(0)
  }

  const getPositionClass = (index) => {
    if (index === selectedCharIndex) return "selected"
    if (index === selectedCharIndex - 1) return "left"
    if (index === selectedCharIndex + 1) return "right"
    return ""
  }

  return {
    selectedCharIndex,
    setSelectedCharIndex,
    isDragging,
    dragOffset,
    dragConstraints,
    handlePrevious,
    handleNext,
    handleDrag,
    handleDragEnd,
    getPositionClass,
  }
}
