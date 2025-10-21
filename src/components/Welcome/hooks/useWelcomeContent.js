import { useTranslation } from "react-i18next"

import { STEP } from "../constants"

export function useWelcomeContent(
  step,
  showIntro,
  currentCharacterIndex,
  data,
) {
  const { t } = useTranslation()
  const { charactersData, characterOverviewData } = data

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
      // Use onboarding text from CMS if available
      const onboardingText = characterOverviewData?.onboarding
        ? characterOverviewData.onboarding.replace(/<[^>]*>/g, "")
        : t("introduction.description")

      return {
        headline: t("introduction.title"),
        description: {
          title: "",
          text: onboardingText,
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
        subHeadline: character.characterType || character.role,
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
