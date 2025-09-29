import { useTranslation } from "react-i18next"

import { STEP } from "../constants"

export function useWelcomeContent(
  step,
  showIntro,
  currentCharacterIndex,
  data,
) {
  const { t } = useTranslation()
  const { charactersData } = data

  const getContent = () => {
    if (step === STEP.INTRO) {
      return {
        headline: t("welcome.title"),
        subHeadline: t("welcome.subtitle"),
        description: {
          title: "",
          text: t("welcome.description"),
        },
        navigationMode: "single",
      }
    } else if (step === STEP.CHARACTER && showIntro) {
      return {
        headline: t("introduction.title"),
        description: {
          title: "",
          text: t("introduction.description"),
        },
        navigationMode: "single",
      }
    } else if (
      step === STEP.CHARACTER &&
      !showIntro &&
      charactersData &&
      charactersData[currentCharacterIndex]
    ) {
      const character = charactersData[currentCharacterIndex]
      return {
        headline: character.name,
        subHeadline: character.role,
        description: {
          title: "",
          text: character.description.replace(/<[^>]*>/g, ""),
        },
        navigationMode: "double",
      }
    }
  }

  return getContent() || {}
}
