import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

import IconButton from "@ui/IconButton"
import RiveAnimation from "@ui/RiveAnimation"

import Rectangle from "./Rectangle.png"
import {
  CameraButtonContainer,
  CharacterImage,
  CharacterImageContainer,
  ContentContainer,
  Headline,
  Image,
  IntroductionContainer,
  RiveAnimationContainer,
  TextBlock,
} from "./styles"

export default function Introduction() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const {
    characterIndex: currentCharacterIndex,
    character,
    introduction,
  } = useLoaderData()

  const heading = introduction?.heading || t("introduction.title")
  const description = introduction?.description
    ? introduction.description.replace(/<[^>]*>/g, "")
    : t("introduction.description")
  const paragraphs = [description]

  const imageUrl = introduction?.image?.file || Rectangle

  if (!character) {
    return (
      <IntroductionContainer data-introduction-container ref={containerRef}>
        <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
          <Headline>
            {t("loading.characters", "Loading characters...")}
          </Headline>
        </ContentContainer>
      </IntroductionContainer>
    )
  }

  return (
    <IntroductionContainer data-introduction-container ref={containerRef}>
      {currentCharacterIndex === 0 ? (
        <RiveAnimationContainer>
          <RiveAnimation src="/amaraWriting.riv" autoplay />
        </RiveAnimationContainer>
      ) : (
        <CharacterImageContainer>
          <CharacterImage
            src={
              character.selectedImage || character.characterImage?.file || ""
            }
            alt={character.name || ""}
          />
        </CharacterImageContainer>
      )}

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>{heading}</Headline>

        {paragraphs.map((paragraph, index) => (
          <TextBlock key={index}>
            {paragraph}
            {index < paragraphs.length - 1 && <br />}
          </TextBlock>
        ))}

        <Image src={imageUrl} />

        <CameraButtonContainer>
          <IconButton
            variant="camera"
            onClick={() => {
              navigate(`/characters/${currentCharacterIndex}/photo-capture`)
            }}
          />
        </CameraButtonContainer>
      </ContentContainer>
    </IntroductionContainer>
  )
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const locale = getCurrentLocale()
    const query = allContentQuery(locale)
    const content = await queryClient.ensureQueryData(query)

    const characterId = params.characterId
    const characterIndex = Number.parseInt(characterId ?? "", 10)

    if (Number.isNaN(characterIndex) || characterIndex < 0) {
      throw new Response("Character not found", { status: 404 })
    }

    const character = extractFromContentTree.getCharacter(
      content,
      characterIndex,
    )

    if (!character) {
      throw new Response("Character not found", { status: 404 })
    }

    const introduction = extractFromContentTree.getIntroduction(
      content,
      characterIndex,
    )

    return { characterIndex, character, introduction }
  }
