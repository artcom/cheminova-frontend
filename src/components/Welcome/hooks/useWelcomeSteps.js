import { useState } from "react"

import { STEP } from "../constants"

export function useWelcomeSteps({
  goToIntroduction,
  showIntro,
  setShowIntro,
  currentCharacterIndex,
  setCurrentCharacterIndex,
  charactersData,
  initialStep = STEP.INTRO,
}) {
  const [step, setStep] = useState(initialStep)

  const advanceFromIntro = () => setStep(STEP.CHARACTER)

  const confirmCharacter = () => {
    setShowIntro(false)
  }

  const onSelect = () => {
    if (step === STEP.INTRO) return advanceFromIntro()
    if (step === STEP.CHARACTER && showIntro) return confirmCharacter()
    if (step === STEP.CHARACTER && !showIntro) return goToIntroduction()
  }

  const handleCharacterPrev = () => {
    if (currentCharacterIndex === 0) return
    setCurrentCharacterIndex(currentCharacterIndex - 1)
  }

  const handleCharacterNext = () => {
    const totalCharacters = charactersData?.length || 0
    const last = totalCharacters - 1
    if (currentCharacterIndex === last) return
    setCurrentCharacterIndex(currentCharacterIndex + 1)
  }

  // Calculate navigation props based on current state
  const getNavigationProps = (navigationMode) => {
    const totalCharacters = charactersData?.length || 0

    return {
      mode: !showIntro ? "select" : navigationMode,
      onSelect,
      onPrev: handleCharacterPrev,
      onNext: handleCharacterNext,
      prevDisabled: currentCharacterIndex === 0,
      nextDisabled: currentCharacterIndex === totalCharacters - 1,
    }
  }

  return {
    step,
    setStep,
    onSelect,
    handleCharacterPrev,
    handleCharacterNext,
    getNavigationProps,
  }
}
