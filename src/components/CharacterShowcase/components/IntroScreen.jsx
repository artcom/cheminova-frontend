import {
  IntroContainer,
  IntroCharactersRow,
  IntroCharacterItem,
  IntroCharacterImage,
  CharacterName,
  IntroHeading,
} from "../styles"
import { CHARACTER_DATA } from "../constants"

export const IntroScreen = ({ onCharacterSelect, onContinue }) => {
  return (
    <IntroContainer>
      <IntroCharactersRow
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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

      <IntroHeading
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onClick={onContinue}
      >
        Enter the world of the beautiful Camp Nou through the eyes of your
        chosen character
      </IntroHeading>
    </IntroContainer>
  )
}
