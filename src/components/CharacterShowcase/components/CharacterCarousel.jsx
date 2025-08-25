import { motion } from "motion/react"
import { styled } from "styled-components"
import { CHARACTER_DATA } from "../constants"
import { useCharacterCarousel } from "../../../hooks/useCharacterCarousel"
import { DRAG_CONFIG } from "../utils/transformUtils"
import CharacterCard from "./CharacterCard"

const CarouselContainer = styled(motion.div)`
  width: 100dvw;
  height: 100%;
  overflow: hidden;
  perspective: 62.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`

const DraggableWrapper = styled(motion.div)`
  display: flex;
  height: 100%;
  width: ${(props) => `${props.$charactersLength * 100}dvw`};
`

export default function CharacterCarousel({
  selectedIndex,
  onSelectionChange,
}) {
  const { x, handleDragEnd, dragConstraints } = useCharacterCarousel(
    selectedIndex,
    CHARACTER_DATA.length,
    (newIndex) => {
      onSelectionChange(newIndex)
    },
  )

  return (
    <CarouselContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <DraggableWrapper
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{ x }}
        $charactersLength={CHARACTER_DATA.length}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={DRAG_CONFIG.elastic}
        dragMomentum={DRAG_CONFIG.momentum}
        onDragEnd={handleDragEnd}
      >
        {CHARACTER_DATA.map((character, index) => {
          const offset = index - selectedIndex
          const absoluteOffset = Math.abs(offset)
          return (
            <CharacterCard
              key={index}
              character={character}
              scale={Math.max(1 - absoluteOffset * 0.2, 0.8)}
              shadowIntensity={absoluteOffset}
            />
          )
        })}
      </DraggableWrapper>
    </CarouselContainer>
  )
}
