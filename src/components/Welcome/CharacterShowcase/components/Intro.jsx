import { useCharactersFromAll } from "@/api/hooks"
import {
  IntroCharacterImage,
  IntroCharacterItem,
  IntroCharactersRow,
  IntroContainer,
} from "@components/Welcome/CharacterShowcase/styles"
import { useTranslation } from "react-i18next"

export default function Intro({ onCharacterSelect }) {
  const { t } = useTranslation()
  const { data: charactersData } = useCharactersFromAll()

  // Return early if no characters data is available yet
  if (!charactersData || charactersData.length === 0) {
    return (
      <IntroContainer>
        {t("loading.characters", "Loading characters...")}
      </IntroContainer>
    )
  }

  return (
    <IntroContainer>
      <IntroCharactersRow
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {charactersData.map((character, index) => (
          <IntroCharacterItem
            key={character.id || character.name}
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
              src={character.image || character.characterImage?.file}
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
