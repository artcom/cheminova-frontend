import React from "react"

import { useSwipe } from "../../hooks/useSwipe"

export default function SliderWheel({
  children,
  taskMetadata,
  currentTaskIndex,
  setCurrentTaskIndex,
}) {
  const cycleCards = (direction) => {
    setCurrentTaskIndex((prevIndex) => {
      if (direction === "left") {
        return (prevIndex + 1) % taskMetadata.length
      } else if (direction === "right") {
        return (prevIndex - 1 + taskMetadata.length) % taskMetadata.length
      }
      return prevIndex
    })
  }

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
    () => cycleCards("right"),
    () => cycleCards("left"),
  )

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {React.cloneElement(children, { currentTaskIndex, setCurrentTaskIndex })}
    </div>
  )
}
