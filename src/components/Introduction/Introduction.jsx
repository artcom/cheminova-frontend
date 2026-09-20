import { getCharacterPersonaFlags } from "@/utils/characterPersona"
import { Alignment, Fit } from "@rive-app/react-canvas"
import { useEffect } from "react"

import IconButton from "@ui/IconButton"
import RichText from "@ui/RichText"
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

export default function Introduction({
  node: introduction,
  characterNode: character,
  characterCode,
  next,
  goTo,
}) {
  const heading = introduction.heading

  const { isArtist, isFuturePerson, isJanitor } =
    getCharacterPersonaFlags(characterCode)
  const shouldShowRiveAnimation = isArtist

  useEffect(() => {
    if (isArtist) fetch("/amaraWriting.riv")
  }, [isArtist])

  const characterImageUrl =
    introduction.characterImage?.file ||
    character?.selectedImage ||
    character?.characterImage?.file

  return (
    <IntroductionContainer
      data-introduction-container
      $backgroundImage={introduction.backgroundImage?.file}
      $isJanitor={isJanitor}
    >
      {shouldShowRiveAnimation ? (
        <RiveAnimationContainer>
          <RiveAnimation
            src="/amaraWriting.riv"
            autoplay
            layout={{ fit: Fit.FitHeight, alignment: Alignment.BottomRight }}
          />
        </RiveAnimationContainer>
      ) : (
        characterImageUrl && (
          <CharacterImageContainer>
            <CharacterImage src={characterImageUrl} alt={character?.name} />
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

          <TextBlock
            as={RichText}
            html={introduction.description}
            $isFuturePerson={isFuturePerson}
          />

          <CameraButtonContainer>
            <IconButton
              variant="camera"
              color={isFuturePerson ? "white" : undefined}
              onClick={() => goTo(next)}
            />
          </CameraButtonContainer>
        </ContentCard>
      </ContentScrollContainer>
    </IntroductionContainer>
  )
}
