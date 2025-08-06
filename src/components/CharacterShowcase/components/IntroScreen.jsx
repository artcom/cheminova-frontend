import {
  IntroContainer,
  IntroCharactersRow,
  IntroCharacterItem,
  IntroCharacterImage,
} from "../styles"
import { CHARACTER_DATA } from "../constants"

export default function IntroScreen({ onCharacterSelect }) {
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
            whileHover={{ y: -10 }}
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
              whileHover={{ scale: 1.05 }}
            />
          </IntroCharacterItem>
        ))}
      </IntroCharactersRow>
    </IntroContainer>
  )
}
