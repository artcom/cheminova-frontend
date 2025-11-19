import { getCharacterPersonaFlags } from "@/utils/characterPersona"
import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCharacterSection } from "@/utils/loaderHelpers"
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

export const clientLoader = async ({ params }) => {
  const {
    section: introduction,
    characterSlug,
    character,
  } = await loadCharacterSection(
    params,
    (content, characterIndex) =>
      extractFromContentTree.getIntroduction(content, characterIndex),
    { missingMessage: "Introduction data missing from CMS" },
  )

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
