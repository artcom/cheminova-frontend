import { useCharactersFromAll, useIntroductionFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

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

export default function Introduction({ goToPhotoCapture }) {
  const { currentCharacterIndex } = useGlobalState()
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const { data: charactersData, isLoading: isCharactersLoading } =
    useCharactersFromAll()

  const currentCharacter = charactersData?.[currentCharacterIndex]

  const { data: introductionData } = useIntroductionFromAll(
    currentCharacterIndex,
  )

  const heading = introductionData?.heading || t("introduction.title")
  const description = introductionData?.description
    ? introductionData.description.replace(/<[^>]*>/g, "")
    : t("introduction.description")
  const paragraphs = [description]

  const imageUrl = introductionData?.image?.file || Rectangle

  if (isCharactersLoading || !currentCharacter) {
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
              currentCharacter.selectedImage ||
              currentCharacter.characterImage?.file ||
              ""
            }
            alt={currentCharacter.name || ""}
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
              goToPhotoCapture()
            }}
          />
        </CameraButtonContainer>
      </ContentContainer>
    </IntroductionContainer>
  )
}
