import { motion } from "motion/react"
import { CHARACTER_DATA } from "../constants"
import { useCharacterCarousel } from "../../../hooks/useCharacterCarousel"
import { CAROUSEL_ANIMATION, DRAG_CONFIG } from "../utils/transformUtils"

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        width: "100dvw",
        height: "100%",
        overflow: "hidden",
        perspective: "62.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{
          display: "flex",
          x,
          height: "100%",
          width: `${CHARACTER_DATA.length * 100}dvw`,
        }}
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
      </motion.div>
    </motion.div>
  )
}

const CharacterCard = ({ character, scale, shadowIntensity }) => {
  return (
    <motion.div
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
      style={{
        flex: "0 0 100dvw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.6,
          ease: "easeOut",
        }}
        src={character.image}
        alt={character.name}
        style={{
          width: "auto",
          height: "60%",
          objectFit: "contain",
          marginBottom: "1.25rem",
          filter: `drop-shadow(0 ${0.5 + shadowIntensity * 0.25}rem ${0.75 + shadowIntensity * 0.5}rem rgba(0, 0, 0, ${0.4 - shadowIntensity * 0.1}))`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          ease: "easeOut",
        }}
        style={{
          color: "white",
          textAlign: "center",
          textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.5)",
          maxWidth: "80%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 1.0,
            ease: "easeOut",
          }}
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          {character.name}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 1.2,
            ease: "easeOut",
          }}
          style={{
            fontSize: "1.1rem",
            opacity: 0.9,
            lineHeight: "1.4",
          }}
        >
          {character.description}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
