import { motion } from "framer-motion"
import { CHARACTER_DATA } from "../constants"
import { useCharacterCarousel } from "../../../hooks/useCharacterCarousel"
import {
  calculateCharacterTransform,
  CAROUSEL_ANIMATION,
  DRAG_CONFIG,
} from "../utils/transformUtils"

export const CharacterCarousel = ({ selectedIndex, onSelectionChange }) => {
  const { x, spacing, handleDragEnd, dragConstraints } = useCharacterCarousel(
    selectedIndex,
    CHARACTER_DATA.length,
    (newIndex) => {
      onSelectionChange(newIndex)
    },
  )

  return (
    <div
      style={{
        width: "100vw",
        height: "100%",
        overflow: "hidden",
        perspective: "1000px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        style={{ display: "flex", x, height: "100%" }}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={DRAG_CONFIG.elastic}
        dragMomentum={DRAG_CONFIG.momentum}
        onDragEnd={handleDragEnd}
      >
        {CHARACTER_DATA.map((character, index) => {
          const transform = calculateCharacterTransform(
            index,
            selectedIndex,
            spacing,
          )

          return (
            <CharacterCard
              key={index}
              character={character}
              transform={transform}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

const CharacterCard = ({ character, transform }) => {
  const { scale, z, y, xOffset, shadowIntensity } = transform

  return (
    <motion.div
      style={{
        flex: "0 0 100vw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
      animate={{
        x: xOffset,
        y: y,
        z: z,
        scale: scale,
      }}
      transition={CAROUSEL_ANIMATION}
    >
      <img
        src={character.image}
        alt={character.name}
        style={{
          width: "auto",
          height: "60%",
          objectFit: "contain",
          marginBottom: "20px",
          filter: `drop-shadow(0 ${8 + shadowIntensity * 4}px ${12 + shadowIntensity * 8}px rgba(0, 0, 0, ${0.4 - shadowIntensity * 0.1}))`,
        }}
      />
      <div
        style={{
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        {character.name}
      </div>
    </motion.div>
  )
}
