import {
  useCharacterOverviewFromAll,
  useCharactersFromAll,
  useWelcomeFromAll,
} from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useState } from "react"

import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

import CharacterShowcase from "./CharacterShowcase"
import { STEP } from "./constants"
import { useWelcomeBackground } from "./hooks/useWelcomeBackground"
import { useWelcomeContent } from "./hooks/useWelcomeContent"
import { useWelcomeSteps } from "./hooks/useWelcomeSteps"
import { ChildrenContainer, Layout, TextLayout } from "./styles"

export default function Welcome({ goToIntroduction }) {
  const [showIntro, setShowIntro] = useState(true)
  const { currentCharacterIndex, setCurrentCharacterIndex } = useGlobalState()

  const { data: welcomeData } = useWelcomeFromAll()
  const { data: characterOverviewData } = useCharacterOverviewFromAll()
  const { data: charactersData } = useCharactersFromAll()

  const { step, setStep, getNavigationProps } = useWelcomeSteps({
    goToIntroduction,
    showIntro,
    setShowIntro,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    charactersData,
  })

  const { headline, subHeadline, description, navigationMode } =
    useWelcomeContent(step, showIntro, currentCharacterIndex, {
      charactersData,
      characterOverviewData,
    })

  const backgroundImage = useWelcomeBackground(
    step,
    welcomeData,
    characterOverviewData,
  )

  return (
    <Layout $backgroundImage={backgroundImage}>
      {step === STEP.CHARACTER && (
        <ChildrenContainer>
          <CharacterShowcase
            onSelect={() => setStep(2)}
            showIntro={showIntro}
            setShowIntro={setShowIntro}
          />
        </ChildrenContainer>
      )}
      <TextLayout $hasDescription={!!description}>
        {headline && (
          <Header
            headline={headline}
            subheadline={subHeadline}
            legalNotice={step === STEP.INTRO}
          />
        )}

        {description && (
          <Description
            title={description.title}
            text={description.text}
            headline={headline}
            subheadline={subHeadline}
          />
        )}
      </TextLayout>
      <Navigation position="default" {...getNavigationProps(navigationMode)} />
      <Vignette />
    </Layout>
  )
}
