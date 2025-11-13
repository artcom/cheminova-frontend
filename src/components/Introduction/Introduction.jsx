import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { getCharacterPersonaFlags } from "@/utils/characterPersona"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import { preloadImages } from "@/utils/preloadImages"
import { sanitizeRichText } from "@/utils/text"
import { useLoaderData, useNavigate } from "react-router-dom"

import IconButton from "@ui/IconButton"
import RiveAnimation from "@ui/RiveAnimation"

import {
  CameraButtonContainer,
  CharacterImage,
  CharacterImageContainer,
  ContentCard,
  ContentScrollContainer,
  Headline,
  Image,
  ImageWrapper,
  IntroductionContainer,
  RiveAnimationContainer,
  TextBlock,
} from "./styles"

export default function Introduction() {
  const navigate = useNavigate()

  const { characterSlug, character, introduction } = useLoaderData()

  if (!introduction) {
    throw new Error("Introduction data is required but missing from CMS")
  }

  if (!character) {
    throw new Error("Character data is required but missing from CMS")
  }

  const heading = introduction.heading
  const description = sanitizeRichText(introduction.description)

  const { isArtist, isFuturePerson, isJanitor } =
    getCharacterPersonaFlags(characterSlug)
  const shouldShowRiveAnimation = isArtist

  const characterImageUrl =
    introduction.characterImage?.file ||
    character.selectedImage ||
    character.characterImage?.file

  return (
    <IntroductionContainer
      data-introduction-container
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

      <ContentScrollContainer>
        <ContentCard
          $isFuturePerson={isFuturePerson}
          $isArtist={isArtist}
          $isJanitor={isJanitor}
        >
          <Headline $isFuturePerson={isFuturePerson} $isJanitor={isJanitor}>
            {heading}
          </Headline>

          {introduction.image?.file && (
            <ImageWrapper>
              <Image src={introduction.image.file} $isJanitor={isJanitor} />
            </ImageWrapper>
          )}

          <TextBlock $isFuturePerson={isFuturePerson}>{description}</TextBlock>

          <CameraButtonContainer>
            <IconButton
              variant="camera"
              color={isFuturePerson ? "white" : undefined}
              onClick={() => {
                navigate(`/characters/${characterSlug}/photo-capture`)
              }}
            />
          </CameraButtonContainer>
        </ContentCard>
      </ContentScrollContainer>
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

  const imagesToPreload = [
    introduction.backgroundImage?.file,
    introduction.image?.file,
    introduction.characterImage?.file,
    character.selectedImage,
    character.characterImage?.file,
  ].filter(Boolean)

  const preloadPromises = [preloadImages(imagesToPreload)]

  if (characterSlug === "artist") {
    preloadPromises.push(
      fetch("/amaraWriting.riv").then((response) => response.blob()),
    )
  }

  await Promise.all(preloadPromises)

  return { characterSlug, character, introduction }
}
