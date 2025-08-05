import { motion } from "motion/react"
import { styled } from "styled-components"
import { CHARACTER_DATA } from "../constants"
import { useCharacterCarousel } from "../../../hooks/useCharacterCarousel"
import { CAROUSEL_ANIMATION, DRAG_CONFIG } from "../utils/transformUtils"

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
  justify-content: center;
  user-select: none;
`

const CharacterImage = styled(motion.img)`
  width: auto;
  height: 60%;
  object-fit: contain;
  margin-bottom: 1.25rem;
  filter: ${(props) =>
    `drop-shadow(0 ${0.5 + props.$shadowIntensity * 0.25}rem ${0.75 + props.$shadowIntensity * 0.5}rem rgba(0, 0, 0, ${0.4 - props.$shadowIntensity * 0.1}))`};
`

const CharacterTextContainer = styled(motion.div)`
  color: white;
  text-align: center;
  text-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.5);
  max-width: 80%;
`

const CharacterName = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const CharacterDescription = styled(motion.div)`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.4;
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

const CharacterCard = ({ character, scale, shadowIntensity }) => {
  return (
    <CharacterCardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: scale,
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
      <CharacterTextContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          ease: "easeOut",
        }}
      >
        <CharacterName
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 1.0,
            ease: "easeOut",
          }}
        >
          {character.name}
        </CharacterName>
        <CharacterDescription
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 1.2,
            ease: "easeOut",
          }}
        >
          {character.description}
        </CharacterDescription>
      </CharacterTextContainer>
    </CharacterCardContainer>
  )
}
