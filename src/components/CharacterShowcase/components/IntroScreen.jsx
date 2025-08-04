import {
  IntroContainer,
  IntroCharactersRow,
  IntroCharacterItem,
  IntroCharacterImage,
  CharacterName,
  IntroHeading,
} from "../styles"
import { CHARACTER_DATA } from "../constants"

export default function IntroScreen({ onCharacterSelect }) {
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
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.6 + index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ y: -10 }}
            onClick={() => onCharacterSelect(index)}
          >
            <IntroCharacterImage
              src={character.image}
              alt={character.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.8 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.05 }}
            />
            <CharacterName
              style={{ fontSize: "1.5rem", marginTop: "10px" }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 1.0 + index * 0.1,
                ease: "easeOut",
              }}
            >
              {character.name}
            </CharacterName>
          </IntroCharacterItem>
        ))}
      </IntroCharactersRow>
    </IntroContainer>
  )
}
