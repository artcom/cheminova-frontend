import { useCharactersFromAll, useIntroductionFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"

import IconButton from "@ui/IconButton"

import Rectangle from "./Rectangle.png"
import {
  CameraButtonContainer,
  CharacterImage,
  CharacterImageContainer,
  ContentContainer,
  Headline,
  Image,
  IntroductionContainer,
  TextBlock,
} from "./styles"

export default function Introduction({ goToPhotoCapture }) {
  const { currentCharacterIndex } = useGlobalState()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const { data: charactersData } = useCharactersFromAll()
  const { data: introData } = useIntroductionFromAll(currentCharacterIndex)

  const currentCharacter = charactersData[currentCharacterIndex]

  const getIntroContent = () => {
    if (introData) {
      return {
        heading: introData.heading,
        description: introData.description,
        image: introData.image?.file,
      }
    }
  }

  const introContent = getIntroContent()

  const cleanDescription = introContent.description
    .replace(/<[^>]*>/g, "")
    .trim()

  const paragraphs = cleanDescription.split("\n\n").filter((p) => p.trim())

  return (
    <IntroductionContainer data-introduction-container ref={containerRef}>
      <CharacterImageContainer>
        <CharacterImage
          src={
            currentCharacter.selectedImage ||
            currentCharacter.characterImage?.file
          }
          alt={currentCharacter.name}
        />
      </CharacterImageContainer>

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>{introContent.heading}</Headline>

        {paragraphs.map((paragraph, index) => (
          <TextBlock key={index}>
            {paragraph}
            {index < paragraphs.length - 1 && <br />}
          </TextBlock>
        ))}

        {introContent.image && (
          <Image src={introContent.image} alt="Introduction scene" />
        )}

        {!introContent.image && <Image src={Rectangle} />}

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
