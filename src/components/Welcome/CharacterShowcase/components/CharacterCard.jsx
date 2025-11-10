import { motion } from "motion/react"
import { styled } from "styled-components"

import { CAROUSEL_ANIMATION } from "../utils/transformUtils"

const CharacterCardContainer = styled(motion.div)`
  flex: 0 0 100dvw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  user-select: none;
`

const CharacterImage = styled(motion.img)`
  width: auto;
  height: 60dvh;
  margin-bottom: 5.25rem;
  object-fit: contain;
  filter: ${(props) =>
    `drop-shadow(0 ${0.5 + props.$shadowIntensity * 0.25}rem ${0.75 + props.$shadowIntensity * 0.5}rem rgba(0, 0, 0, ${0.4 - props.$shadowIntensity * 0.1}))`};
`

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
        src={character.characterImage?.file}
        alt={character.name}
        $shadowIntensity={shadowIntensity}
      />
    </CharacterCardContainer>
  )
}

export default CharacterCard
