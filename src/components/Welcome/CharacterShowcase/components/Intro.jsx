import { CHARACTER_DATA } from "@components/Welcome/CharacterShowcase/constants"
import {
  IntroCharacterImage,
  IntroCharacterItem,
  IntroCharactersRow,
  IntroContainer,
} from "@components/Welcome/CharacterShowcase/styles"

export default function Intro({ onCharacterSelect }) {
  return (
    <IntroContainer>
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
            onClick={() => onCharacterSelect(index)}
          >
            <IntroCharacterImage
              src={character.image}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.8 + index * 0.1,
                ease: "easeOut",
              }}
            />
          </IntroCharacterItem>
        ))}
      </IntroCharactersRow>
    </IntroContainer>
  )
}
