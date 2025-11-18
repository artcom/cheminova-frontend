import React, { useMemo } from "react"

import { useSwipe } from "./hooks/useSwipe"
import { getCardPositions, SlideItem, Wrapper } from "./styles"

const SliderWheel = ({
  children,
  currentTaskIndex,
  setCurrentTaskIndex,
  taskMetadata,
  characterSlug = undefined,
}) => {
  const slideChildren = React.Children.toArray(children)
  const slideCount = slideChildren.length
  const fallbackCount = taskMetadata?.length || 0
  const effectiveCardCount = slideCount || fallbackCount || 1
  const canSwipe = slideCount > 1

  const cycleCards = (direction) => {
    if (!canSwipe) return
    setCurrentTaskIndex((prevIndex) => {
      const totalSlides = slideCount
      if (totalSlides <= 0) return 0
      if (direction === "left") {
        return (prevIndex + 1) % totalSlides
      } else if (direction === "right") {
        return (prevIndex - 1 + totalSlides) % totalSlides
      }
      return prevIndex
    })
  }

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
    () => cycleCards("right"),
    () => cycleCards("left"),
  )

  const cardPositions = useMemo(
    () => getCardPositions(Math.min(effectiveCardCount, 3)),
    [effectiveCardCount],
  )

  const normalizedCurrentIndex =
    slideCount > 0
      ? ((currentTaskIndex % slideCount) + slideCount) % slideCount
      : 0

  return (
    <Wrapper
      onTouchStart={canSwipe ? handleTouchStart : undefined}
      onTouchMove={canSwipe ? handleTouchMove : undefined}
      onTouchEnd={canSwipe ? handleTouchEnd : undefined}
    >
      {slideChildren.map((child, index) => {
        if (!cardPositions.length) return null

        const positionIndex =
          slideCount > 0
            ? (index - normalizedCurrentIndex + slideCount) % slideCount
            : 0
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
