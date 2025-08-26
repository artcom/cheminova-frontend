import { useCallback, useEffect, useState } from "react"

import {
  CHARACTER_DATA,
  DRAG_THRESHOLD,
} from "../components/CharacterShowcase/constants"

export const useCharacterSelection = () => {
  const [selectedCharIndex, setSelectedCharIndex] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragConstraints, setDragConstraints] = useState({
    left: -200,
    right: 200,
  })

  // Update drag constraints based on screen size
  useEffect(() => {
    const updateDragConstraints = () => {
      const width = window.innerWidth
      let constraints

      if (width > 768) {
        constraints = { left: -300, right: 300 }
      } else if (width > 480) {
        constraints = { left: -250, right: 250 }
      } else {
        constraints = { left: -150, right: 150 }
      }

      setDragConstraints(constraints)
    }

    updateDragConstraints()
    window.addEventListener("resize", updateDragConstraints)

    return () => {
      window.removeEventListener("resize", updateDragConstraints)
    }
  }, [])

  const handlePrevious = useCallback(() => {
    if (selectedCharIndex > 0) {
      setSelectedCharIndex(selectedCharIndex - 1)
      setDragOffset(0)
      return true
    }
    return false
  }, [selectedCharIndex])

  const handleNext = useCallback(() => {
    if (selectedCharIndex < CHARACTER_DATA.length - 1) {
      setSelectedCharIndex(selectedCharIndex + 1)
      setDragOffset(0)
      return true
    }
    return false
  }, [selectedCharIndex])

  const handleDrag = useCallback((_, info) => {
    setIsDragging(true)
    setDragOffset(info.offset.x)
  }, [])

  const handleDragEnd = useCallback(
    (_, info) => {
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
    },
    [selectedCharIndex, handleNext, handlePrevious],
  )

  const getPositionClass = useCallback(
    (index) => {
      if (index === selectedCharIndex) return "selected"
      if (index === selectedCharIndex - 1) return "left"
      if (index === selectedCharIndex + 1) return "right"
      return ""
    },
    [selectedCharIndex],
  )

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
