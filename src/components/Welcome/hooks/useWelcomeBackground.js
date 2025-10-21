import LaNau from "@ui/assets/LaNau.webp"

import { STEP } from "../constants"

export function useWelcomeBackground(step, welcomeData, characterOverviewData) {
  if (step === STEP.INTRO && welcomeData?.backgroundImage?.file) {
    return welcomeData.backgroundImage.file
  } else if (
    step === STEP.CHARACTER &&
    characterOverviewData?.backgroundImage?.file
  ) {
    return characterOverviewData.backgroundImage.file
  }
  return LaNau
}
