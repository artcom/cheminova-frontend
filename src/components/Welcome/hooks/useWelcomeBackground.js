import { STEP } from "../constants"

export function useWelcomeBackground(
  step,
  welcomeIntroData,
  characterOverviewData,
) {
  if (step === STEP.INTRO) {
    return welcomeIntroData.backgroundImage.file
  } else if (step === STEP.CHARACTER) {
    return characterOverviewData.backgroundImage.file
  }
}
