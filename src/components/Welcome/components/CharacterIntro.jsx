import { useTranslation } from "react-i18next"
import { useRouteLoaderData } from "react-router-dom"

import {
  IntroCharacterImage,
  IntroCharacterItem,
  IntroCharactersRow,
  IntroContainer,
} from "../characterStyles"

export default function Intro({ onCharacterSelect, characters }) {
  const { t } = useTranslation()
  const loaderData = useRouteLoaderData("welcome")
  const charactersData = characters ?? loaderData?.characters ?? []

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
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
      >
        {charactersData.map((character, index) => (
          <IntroCharacterItem
            key={character.id || character.name}
            variants={{
              hidden: { y: 50, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                },
              },
            }}
            onClick={() => onCharacterSelect(index)}
            whileTap={{ scale: 0.95 }}
          >
            <IntroCharacterImage
              src={character.image || character.characterImage?.file}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            />
          </IntroCharacterItem>
        ))}
      </IntroCharactersRow>
    </IntroContainer>
  )
}
