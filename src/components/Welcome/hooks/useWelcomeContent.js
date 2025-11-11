import { STEP } from "../constants"

export function useWelcomeContent(
  step,
  showIntro,
  currentCharacterIndex,
  data,
) {
  const { charactersData, characterOverviewData, welcomeIntroData } = data

  const getContent = () => {
    if (step === STEP.INTRO) {
      return {
        headline: welcomeIntroData.title,
        subHeadline: welcomeIntroData.siteName,
        description: {
          title: welcomeIntroData.description,
          text: welcomeIntroData.introText.replace(/<[^>]*>/g, ""),
        },
        navigationMode: "single",
      }
    } else if (step === STEP.CHARACTER && showIntro) {
      return {
        headline: characterOverviewData.title,
        subHeadline: characterOverviewData.siteName,
        description: {
          title: "",
          text: characterOverviewData.onboarding.replace(/<[^>]*>/g, ""),
        },
        navigationMode: "single",
      }
    } else if (step === STEP.CHARACTER && !showIntro) {
      const character = charactersData[currentCharacterIndex]
      return {
        headline: character.name,
        subHeadline: character.characterType,
        description: {
          title: "",
          text: character.description.replace(/<[^>]*>/g, ""),
        },
        navigationMode: "double",
      }
    }
  }

  return getContent()
}
