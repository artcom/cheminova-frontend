import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"
import {
  CAROUSEL_ANIMATION,
  DRAG_CONFIG,
} from "@components/CharacterShowcase/utils/transformUtils"
import { useCharacterCarousel } from "@hooks/useCharacterCarousel"
import { motion } from "motion/react"
import { styled } from "styled-components"

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

const CharacterCardContainer = styled(motion.div)`
  flex: 0 0 100dvw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  user-select: none;
  margin-bottom: 5.25rem;
  transform-origin: bottom;
`

const CharacterImage = styled(motion.img)`
  width: auto;
  height: 60dvh;
  margin-bottom: 5.25rem;
  object-fit: contain;
  filter: ${({ $shadowIntensity }) =>
    `drop-shadow(0 ${0.5 + $shadowIntensity * 0.25}rem ${0.75 + $shadowIntensity * 0.5}rem rgba(0, 0, 0, ${0.4 - $shadowIntensity * 0.1}))`};
`

const CharacterCarousel = ({ selectedIndex, onSelectionChange }) => {
  const { x, handleDragEnd, dragConstraints } = useCharacterCarousel(
    selectedIndex,
    CHARACTER_DATA.length,
    onSelectionChange,
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
              key={character.id}
              character={character}
              scale={Math.max(1 - absoluteOffset * 0.2, 0.9)}
              shadowIntensity={absoluteOffset}
            />
          )
        })}
      </DraggableWrapper>
    </CarouselContainer>
  )
}

const CharacterCard = ({ character, scale, shadowIntensity }) => (
  <CharacterCardContainer
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: 0,
      scale,
    }}
    transition={{
      duration: 0.5,
      delay: 0.4,
      ease: "easeOut",
      scale: CAROUSEL_ANIMATION,
    }}
  >
    <CharacterImage
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.6,
        ease: "easeOut",
      }}
      src={character.image}
      alt={character.name}
      $shadowIntensity={shadowIntensity}
    />
  </CharacterCardContainer>
)

export default CharacterCarousel
