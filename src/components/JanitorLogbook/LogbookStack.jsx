import { AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useMemo, useState } from "react"
import styled from "styled-components"

import { LogbookCard } from "./LogbookCard"

const StackContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px; /* Adjust based on viewport */
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
`

// Simple deterministic random function
const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const EndMessage = styled.div`
  color: #f0efe9;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  h3 {
    font-family: "Bricolage Grotesque Variable", sans-serif;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  p {
    font-size: 16px;
    opacity: 0.7;
    margin: 0;
  }
`

export function LogbookStack({ items, currentIndex, onIndexChange }) {
  const [exitX, setExitX] = useState(0)

  // Motion value just for tracking drag offset to animate background cards
  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-200, 200], [-10, 10])
  const opacity = useTransform(
    dragX,
    [-200, -100, 0, 100, 200],
    [0, 1, 1, 1, 0],
  )

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      // Swiped right
      setExitX(200)
      onIndexChange(Math.min(currentIndex + 1, items.length))
    } else if (info.offset.x < -100) {
      // Swiped left
      setExitX(-200)
      onIndexChange(Math.min(currentIndex + 1, items.length))
    }

    // Reset the drag tracker for the next card
    // We use a timeout to allow the exit animation to start if needed,
    // but since we change index, the old card unmounts.
    // The new card needs dragX to be 0.
    dragX.set(0)
  }

  // We show up to 3 cards for better depth
  const visibleItems = items.slice(currentIndex, currentIndex + 3)

  // Generate stable random offsets for all items using deterministic randomness
  const offsets = useMemo(() => {
    return items.map((_, index) => {
      const seed = index + 1 // Avoid 0
      const random1 = pseudoRandom(seed)
      const random2 = pseudoRandom(seed * 100)

      return {
        x: random1 * 40 - 20, // Random x between -20 and 20
        rotate: random2 * 10 - 5, // Random rotation between -5 and 5
      }
    })
  }, [items])

  if (currentIndex >= items.length) {
    return (
      <StackContainer>
        <EndMessage>
          <h3>End of Logbook</h3>
          <p>Check back later for more entries.</p>
        </EndMessage>
      </StackContainer>
    )
  }

  return (
    <StackContainer>
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item, index) => {
          const isTop = index === 0
          // Actual index in the full array to get the stable offset
          const realIndex = currentIndex + index
          const randomOffset = offsets[realIndex] || { x: 0, rotate: 0 }

          // Stack effect calculations
          const yOffset = index * 15 // 15px down per card
          const scale = 1 - index * 0.05 // 5% smaller per card
          const zIndex = visibleItems.length - index

          // Disable drag for the very last item in the entire list
          const isLastItem = realIndex === items.length - 1
          const canDrag = isTop && !isLastItem

          return (
            <LogbookCard
              key={item.id}
              data={item}
              drag={canDrag ? "x" : false}
              dragSnapToOrigin // Snap back if not swiped far enough
              onDrag={(e, info) => {
                if (canDrag) dragX.set(info.offset.x)
              }}
              onDragEnd={canDrag ? handleDragEnd : undefined}
              // Exit animation for the swiped card
              exit={
                canDrag
                  ? {
                      x: exitX,
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }
                  : undefined
              }
              // Use animate prop for smooth transitions of stack positions
              animate={{
                scale: isTop ? 1 : scale,
                y: isTop ? 0 : yOffset,
                x: isTop ? 0 : randomOffset.x,
                rotate: isTop ? 0 : randomOffset.rotate,
                opacity: isTop ? 1 : 1 - index * 0.2,
                zIndex: zIndex,
              }}
              // Style prop
              style={{
                // For top card, we ONLY bind rotate to the dragX (to tilt while dragging)
                // We DO NOT bind x, so it moves freely with the drag gesture
                rotate: canDrag ? rotate : undefined,
                opacity: canDrag ? opacity : undefined, // Apply opacity for fade out on drag

                // For background cards, we don't bind x/rotate to dragX directly here,
                // they are handled by 'animate' which updates when index changes.
                // If we wanted background cards to peek *during* drag, we'd need to bind them to transforms of dragX.
                // For now, let's keep it simple: they stay put until swipe completes.

                cursor: canDrag ? "grab" : "default",
                top: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            />
          )
        })}
      </AnimatePresence>
    </StackContainer>
  )
}
