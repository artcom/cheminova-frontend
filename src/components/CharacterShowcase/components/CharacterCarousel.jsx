import * as m from "motion/react-m"
import { LazyMotion } from "motion/react"
import { CHARACTER_DATA } from "../constants"
import { useCharacterCarousel } from "../../../hooks/useCharacterCarousel"
import { CAROUSEL_ANIMATION, DRAG_CONFIG } from "../utils/transformUtils"
export const CharacterCarousel = ({ selectedIndex, onSelectionChange }) => {
  const { x, handleDragEnd, dragConstraints } = useCharacterCarousel(
    selectedIndex,
    CHARACTER_DATA.length,
    (newIndex) => {
      onSelectionChange(newIndex)
    },
  )
  const loadFeatures = () =>
    import("../../UI/features.js").then((res) => res.default)
  return (
    <div
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
      <LazyMotion features={loadFeatures} strict>
        <m.div
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
        </m.div>
      </LazyMotion>
    </div>
  )
}

const CharacterCard = ({ character, scale, shadowIntensity }) => {
  return (
    <m.div
      style={{
        flex: "0 0 100dvw",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      animate={{
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
          marginBottom: "1.25rem",
          filter: `drop-shadow(0 ${0.5 + shadowIntensity * 0.25}rem ${0.75 + shadowIntensity * 0.5}rem rgba(0, 0, 0, ${0.4 - shadowIntensity * 0.1}))`,
        }}
      />
      <div
        style={{
          color: "white",
          textAlign: "center",
          textShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.5)",
          maxWidth: "80%",
        }}
      >
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          {character.name}
        </div>
        <div
          style={{
            fontSize: "1.1rem",
            opacity: 0.9,
            lineHeight: "1.4",
          }}
        >
          {character.description}
        </div>
      </div>
    </m.div>
  )
}
