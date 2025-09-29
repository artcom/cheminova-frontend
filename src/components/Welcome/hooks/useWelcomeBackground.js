import LaNau from "@ui/assets/LaNau.webp"

import { STEP } from "../constants"

/**
 * Custom hook for managing Welcome component background image selection
 * @param {number} step - Current step (STEP.INTRO or STEP.CHARACTER)
 * @param {Object} welcomeData - Welcome data from API
 * @param {Object} characterOverviewData - Character overview data from API
 * @returns {string} Background image URL with fallback to LaNau
 */
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
