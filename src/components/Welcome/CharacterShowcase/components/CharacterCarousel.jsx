import {
  CAROUSEL_ANIMATION,
  DRAG_CONFIG,
} from "@components/Welcome/CharacterShowcase/utils/transformUtils"
import { motion } from "motion/react"
import { useTranslation } from "react-i18next"
import { useRouteLoaderData } from "react-router-dom"
import { styled } from "styled-components"

import { useCharacterCarousel } from "../hooks/useCharacterCarousel"

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
  z-index: -1;
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
  const { t } = useTranslation()
  const loaderData = useRouteLoaderData("welcome")
  const charactersData = loaderData?.characters ?? []

  const { x, handleDragStart, handleDragEnd, dragConstraints } =
    useCharacterCarousel(
      selectedIndex,
      charactersData?.length || 0,
      onSelectionChange,
    )

  // Return early if no characters data is available yet
  if (!charactersData || charactersData.length === 0) {
    return (
      <CarouselContainer>
        {t("loading.characters", "Loading characters...")}
      </CarouselContainer>
    )
  }

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
        $charactersLength={charactersData.length}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={DRAG_CONFIG.elastic}
        dragMomentum={DRAG_CONFIG.momentum}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {charactersData.map((character, index) => {
          const offset = index - selectedIndex
          const absoluteOffset = Math.abs(offset)
          return (
            <CharacterCard
              key={character.id || character.name}
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
      src={character.image || character.characterImage?.file}
      alt={character.name}
      $shadowIntensity={shadowIntensity}
    />
  </CharacterCardContainer>
)

export default CharacterCarousel
