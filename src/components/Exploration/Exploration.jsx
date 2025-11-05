import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"
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

export default function Exploration() {
  const { t } = useTranslation()
  const {
    characterIndex: currentCharacterIndex,
    character,
    exploration,
  } = useLoaderData()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)
  const navigate = useNavigate()

  if (!character) {
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
    if (exploration) {
      return {
        heading: exploration.heading || t("exploration.title"),
        description: exploration.description
          ? exploration.description.replace(/<[^>]*>/g, "")
          : t("exploration.content.stone1"),
        topImage: exploration.topImage?.file || FirstImage,
        bottomImage: exploration.bottomImage?.file || SecondImage,
      }
    }
    return {
      heading: t("exploration.title"),
      description: t("exploration.content.stone1"),
      topImage: FirstImage,
      bottomImage: SecondImage,
    }
  }

  const explorationContent = getExplorationContent()

  return (
    <IntroductionContainer ref={containerRef}>
      <CharacterImageContainer>
        <CharacterImage src={character.selectedImage || ""} />
      </CharacterImageContainer>

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>{explorationContent.heading}</Headline>

        <Image src={explorationContent.topImage} />

        <TextBlock>{t("exploration.content.stone1")}</TextBlock>

        <TextBlock>{t("exploration.content.stone2")}</TextBlock>

        <Image src={explorationContent.bottomImage} />

        <TextBlock>{explorationContent.description}</TextBlock>

        <StyledNavigation
          mode="single"
          onSelect={() =>
            navigate(`/characters/${currentCharacterIndex}/perspective`)
          }
          iconColor="black"
        />
      </ContentContainer>
    </IntroductionContainer>
  )
}

export async function clientLoader({ params }) {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characterId = params.characterId
  const characterIndex = Number.parseInt(characterId ?? "", 10)

  if (Number.isNaN(characterIndex) || characterIndex < 0) {
    throw new Response("Character not found", { status: 404 })
  }

  const character = extractFromContentTree.getCharacter(content, characterIndex)

  if (!character) {
    throw new Response("Character not found", { status: 404 })
  }

  const exploration = extractFromContentTree.getExploration(
    content,
    characterIndex,
  )

  return { characterIndex, character, exploration }
}
