import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

import IconButton from "@ui/IconButton"
import RiveAnimation from "@ui/RiveAnimation"

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
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const { characterSlug, character, introduction } = useLoaderData()

  if (!introduction) {
    throw new Error("Introduction data is required but missing from CMS")
  }

  if (!character) {
    throw new Error("Character data is required but missing from CMS")
  }

  const heading = introduction.heading
  const description = introduction.description.replace(/<[^>]*>/g, "")

  const shouldShowRiveAnimation = characterSlug === "artist"

  const characterImageUrl =
    introduction.characterImage?.file ||
    character.selectedImage ||
    character.characterImage?.file

  return (
    <IntroductionContainer
      data-introduction-container
      ref={containerRef}
      $backgroundImage={introduction.backgroundImage?.file}
    >
      {shouldShowRiveAnimation ? (
        <RiveAnimationContainer>
          <RiveAnimation src="/amaraWriting.riv" autoplay />
        </RiveAnimationContainer>
      ) : (
        characterImageUrl && (
          <CharacterImageContainer>
            <CharacterImage src={characterImageUrl} alt={character.name} />
          </CharacterImageContainer>
        )
      )}

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>{heading}</Headline>

        <TextBlock>{description}</TextBlock>

        {introduction.image?.file && <Image src={introduction.image.file} />}

        <CameraButtonContainer>
          <IconButton
            variant="camera"
            onClick={() => {
              navigate(`/characters/${characterSlug}/photo-capture`)
            }}
          />
        </CameraButtonContainer>
      </ContentContainer>
    </IntroductionContainer>
  )
}

export async function clientLoader({ params }) {
  const characterSlug = params.characterId
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characters = extractFromContentTree.getCharacters(content)
  const characterIndex = findCharacterIndexBySlug(characters, characterSlug)

  if (characterIndex === null) {
    throw new Response("Character not found", { status: 404 })
  }

  const character = extractFromContentTree.getCharacter(content, characterIndex)
  const introduction = extractFromContentTree.getIntroduction(
    content,
    characterIndex,
  )

  if (!character) {
    throw new Response("Character data missing from CMS", { status: 500 })
  }

  if (!introduction) {
    throw new Response("Introduction data missing from CMS", { status: 500 })
  }

  return { characterSlug, character, introduction }
}
