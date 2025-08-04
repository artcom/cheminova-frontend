import {
  IntroContainer,
  IntroCharactersRow,
  IntroCharacterItem,
  IntroCharacterImage,
  CharacterName,
  IntroHeading,
} from "../styles"
// No direct framer-motion import, all motion props are handled by styled(m.div) etc from styles.js
import { CHARACTER_DATA } from "../constants"

export const IntroScreen = ({ onCharacterSelect }) => {
  return (
    <IntroContainer>
      <IntroHeading
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ fontSize: "3rem", marginBottom: "1rem" }}
      >
        Your guide
      </IntroHeading>

      <IntroHeading
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ fontSize: "1.5rem", marginBottom: "3rem", opacity: 0.8 }}
      >
        Choose one character
      </IntroHeading>

      <IntroCharactersRow
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {CHARACTER_DATA.map((character, index) => (
          <IntroCharacterItem
            key={character.id}
            whileHover={{ y: -10 }}
            onClick={() => onCharacterSelect(index)}
          >
            <IntroCharacterImage
              src={character.image}
              alt={character.name}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <CharacterName style={{ fontSize: "1.5rem", marginTop: "10px" }}>
              {character.name}
            </CharacterName>
          </IntroCharacterItem>
        ))}
      </IntroCharactersRow>
    </IntroContainer>
  )
}
