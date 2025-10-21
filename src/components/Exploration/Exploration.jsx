import { useCharactersFromAll, usePhotographyFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { styled } from "styled-components"

import Navigation from "../UI/Navigation"
import FirstImage from "./1stImage.png"
import SecondImage from "./2ndImage.png"
import {
  CharacterImage,
  CharacterImageContainer,
  ContentContainer,
  Headline,
  Image,
  IntroductionContainer,
  TextBlock,
} from "./styles"

const StyledNavigation = styled(Navigation)`
  bottom: 10%;
`

export default function Exploration({ goToPerspective }) {
  const { t } = useTranslation()
  const { currentCharacterIndex } = useGlobalState()
  const { data: charactersData, isLoading: isCharactersLoading } =
    useCharactersFromAll()
  const { data: photographyData } = usePhotographyFromAll(currentCharacterIndex)
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const currentCharacter = charactersData?.[currentCharacterIndex]

  if (isCharactersLoading || !currentCharacter) {
    return (
      <IntroductionContainer ref={containerRef}>
        <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
          <Headline>
            {t("loading.characters", "Loading characters...")}
          </Headline>
        </ContentContainer>
      </IntroductionContainer>
    )
  }

  const getExplorationContent = () => {
    if (photographyData) {
      return {
        heading: photographyData.heading || t("exploration.title"),
        description: photographyData.description
          ? photographyData.description.replace(/<[^>]*>/g, "")
          : t("exploration.content.stone1"),
      }
    }
    return {
      heading: t("exploration.title"),
      description: t("exploration.content.stone1"),
    }
  }

  const explorationContent = getExplorationContent()

  return (
    <IntroductionContainer ref={containerRef}>
      <CharacterImageContainer>
        <CharacterImage src={currentCharacter.selectedImage || ""} />
      </CharacterImageContainer>

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>{explorationContent.heading}</Headline>

        <Image src={FirstImage} />

        <TextBlock>{t("exploration.content.stone1")}</TextBlock>

        <TextBlock>{t("exploration.content.stone2")}</TextBlock>

        <Image src={SecondImage} />

        <TextBlock>{explorationContent.description}</TextBlock>

        <StyledNavigation
          mode="single"
          onSelect={goToPerspective}
          iconColor="black"
        />
      </ContentContainer>
    </IntroductionContainer>
  )
}
