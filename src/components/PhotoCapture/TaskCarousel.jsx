import { motion } from "motion/react"
import React from "react"
import { styled } from "styled-components"

import { useCharacterCarousel } from "../Welcome/useCharacterCarousel"
import { DRAG_CONFIG } from "../Welcome/utils/transformUtils"

const CarouselContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 62.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  touch-action: none; /* Prevent browser scrolling while dragging */
`

const DraggableWrapper = styled(motion.div)`
  display: flex;
  height: 100%;
  width: ${(props) => `${props.$itemsLength * 100}vw`};
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`

const SlideContainer = styled(motion.div)`
  flex: 0 0 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform-origin: center;

  & > * {
    flex-shrink: 0;
  }
`

const TaskCarousel = ({
  selectedIndex,
  onSelectionChange,
  children,
  ...props
}) => {
  const items = React.Children.toArray(children)

  const { x, handleDragStart, handleDragEnd, dragConstraints } =
    useCharacterCarousel(selectedIndex, items.length, onSelectionChange)

  return (
    <CarouselContainer {...props}>
      <DraggableWrapper
        style={{ x }}
        $itemsLength={items.length}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={DRAG_CONFIG.elastic}
        dragMomentum={DRAG_CONFIG.momentum}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {items.map((child, index) => {
          const offset = index - selectedIndex
          const absoluteOffset = Math.abs(offset)
          const scale = Math.max(1 - absoluteOffset * 0.1, 0.9) // Subtle scaling
          const opacity = Math.max(1 - absoluteOffset * 0.5, 0.3) // Fade out neighbors

          return (
            <SlideContainer
              key={index}
              animate={{
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {child}
            </SlideContainer>
          )
        })}
      </DraggableWrapper>
    </CarouselContainer>
  )
}

export default TaskCarousel
