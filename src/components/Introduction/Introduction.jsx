import useGlobalState from "@/hooks/useGlobalState"
import { CHARACTER_DATA } from "@components/Welcome/CharacterShowcase/constants"
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
  const { selectedCharacter, currentCharacterIndex } = useGlobalState()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const currentCharacter =
    selectedCharacter || CHARACTER_DATA[currentCharacterIndex]

  return (
    <IntroductionContainer data-introduction-container ref={containerRef}>
      <CharacterImageContainer>
        <CharacterImage
          src={currentCharacter.selectedImage}
          alt={currentCharacter.name}
        />
      </CharacterImageContainer>

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>Hello Passenger,</Headline>

        <TextBlock>
          It&apos;s great to have you here. I have been working intensively on
          this monument over the last few months.
          <br />
          <br />
          As an artist, I look for meaning in details others might overlook: a
          shadow, a surface, a shape.
        </TextBlock>

        <Image src={Rectangle} />

        <TextBlock>
          This monument is full of stories, if you take the time to notice them.
          Use your camera to explore. What catches your eye?
        </TextBlock>

        <CameraButtonContainer>
          <IconButton variant="camera" onClick={goToPhotoCapture} />
        </CameraButtonContainer>
      </ContentContainer>
    </IntroductionContainer>
  )
}
