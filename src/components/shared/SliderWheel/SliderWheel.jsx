import React from "react"

import { useSwipe } from "../../../hooks/useSwipe"
import { cardPositions, SlideItem, Wrapper } from "./styles"

const SliderWheel = ({
  children,
  currentTaskIndex,
  setCurrentTaskIndex,
  taskMetadata,
  characterSlug = undefined,
}) => {
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
    <Wrapper
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {React.Children.map(children, (child, index) => {
        const positionIndex =
          (index - currentTaskIndex + taskMetadata.length) % taskMetadata.length
        const { x, y, opacity, zIndex } = cardPositions[positionIndex] || {}

        return (
          <SlideItem
            key={index}
            $characterId={characterSlug}
            $y={y}
            $x={x}
            opacity={opacity}
            $zIndex={zIndex}
          >
            {child}
          </SlideItem>
        )
      })}
    </Wrapper>
  )
}

export default SliderWheel
