import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { getCurrentLocale } from "@/i18n"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

import Description from "@ui/Description"
import Header from "@ui/Header"
import LanguageSelector from "@ui/LanguageSelector"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

import CharacterShowcase from "./CharacterShowcase"
import { STEP } from "./constants"
import { useWelcomeBackground } from "./hooks/useWelcomeBackground"
import { useWelcomeContent } from "./hooks/useWelcomeContent"
import { useWelcomeSteps } from "./hooks/useWelcomeSteps"
import {
  ChildrenContainer,
  LanguageSelectorContainer,
  Layout,
  TextLayout,
} from "./styles"

export default function Welcome() {
  const [showIntro, setShowIntro] = useState(true)
  const {
    currentCharacterIndex,
    setCurrentCharacterIndex,
    clearCapturedImages,
  } = useGlobalState()
  const navigate = useNavigate()

  const { welcome, characterOverview, characters } = useLoaderData()

  const welcomeData = welcome
  const characterOverviewData = characterOverview
  const charactersData = characters

  const handleGoToIntroduction = () => {
    clearCapturedImages()
    navigate(`/characters/${currentCharacterIndex}/introduction`)
  }

  const { step, setStep, getNavigationProps } = useWelcomeSteps({
    goToIntroduction: handleGoToIntroduction,
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
            characters={charactersData}
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
      <LanguageSelectorContainer>
        <LanguageSelector />
      </LanguageSelectorContainer>
    </Layout>
  )
}

export const loader = (queryClient) => async () => {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const welcome = extractFromContentTree.getWelcome(content)
  const characterOverview = extractFromContentTree.getCharacterOverview(content)
  const characters = extractFromContentTree.getCharacters(content)

  return {
    welcome,
    characterOverview,
    characters,
  }
}
