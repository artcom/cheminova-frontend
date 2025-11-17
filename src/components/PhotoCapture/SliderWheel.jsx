import React from "react"
import { useLoaderData } from "react-router-dom"
import styled from "styled-components"

import { useSwipe } from "../../hooks/useSwipe"
import { cardPositions, characterStyles } from "./styles"

const SliderWheelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  width: 19.25rem;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const SlideItem = styled.div`
  position: absolute;
  width: 16.3625rem;
  height: 20.93125rem;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1.625rem;
  border-radius: 1.75rem;
  transform: ${({ transform }) => transform};
  opacity: ${({ opacity }) => opacity};
  z-index: ${({ $zIndex }) => $zIndex};
  background-color: ${({ $characterId }) =>
    characterStyles[$characterId]?.backgroundColor || "#f1ece1"};
  border: ${({ $characterId }) =>
    characterStyles[$characterId]?.border || "none"};
  transition:
    all 0.3s ease,
    opacity 0.3s ease;
`

const SliderWheel = ({
  children,
  currentTaskIndex,
  setCurrentTaskIndex,
  taskMetadata,
}) => {
  const { characterSlug } = useLoaderData()

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
    <SliderWheelWrapper
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {React.Children.map(children, (child, index) => {
        const isActive = index === currentTaskIndex
        const positionIndex =
          (index - currentTaskIndex + taskMetadata.length) % taskMetadata.length
        const { x, y, opacity, zIndex } = cardPositions[positionIndex] || {}

        return (
          <SlideItem
            key={index}
            $characterId={characterSlug}
            $top={y}
            $left={`calc(50% + ${x})`}
            transform={`translate(-50%, -50%)`}
            opacity={opacity}
            $zIndex={zIndex}
          >
            {React.cloneElement(child, { isActive })}
          </SlideItem>
        )
      })}
    </SliderWheelWrapper>
  )
}

export default SliderWheel
