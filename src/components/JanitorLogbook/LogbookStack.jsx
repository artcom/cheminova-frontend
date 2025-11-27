import { AnimatePresence } from "framer-motion"
import { useMemo } from "react"
import styled from "styled-components"

import { LogbookCard } from "./LogbookCard"

const StackContainer = styled.div`
  position: relative;
  width: 100%;
  height: min(37.5rem, 65vh); /* Adjust based on viewport */
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
`

export function LogbookStack({ items, currentIndex, onIndexChange }) {
  // We show up to 3 cards for better depth
  const visibleItems = useMemo(() => {
    const visible = []
    const count = Math.min(items.length, 3)
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % items.length
      visible.push({ ...items[index], index: i })
    }
    return visible
  }, [items, currentIndex])

  return (
    <StackContainer>
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item) => (
          <LogbookCard
            key={item.id}
            data={item}
            index={item.index}
            onSwipe={() => onIndexChange((currentIndex + 1) % items.length)}
          />
        ))}
      </AnimatePresence>
    </StackContainer>
  )
}
