import useGlobalState from "@/hooks/useGlobalState"
import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"
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

export default function Exploration() {
  const { selectedCharacter, currentCharacterIndex, goNext } = useGlobalState()
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
        <Headline>Hello again,</Headline>

        <TextBlock>
          You took great photos — it&apos;s nice to see the monument from your
          perspective. I also found some nice things; let me show you how I look
          at different details.
        </TextBlock>

        <Image src={Rectangle} />

        <TextBlock>
          As we walk through these impressions, notice textures, light, and
          shapes. When you&apos;re ready, continue and we&apos;ll jump into your
          image gallery.
        </TextBlock>

        <CameraButtonContainer>
          <IconButton variant="camera" onClick={goNext} />
        </CameraButtonContainer>
      </ContentContainer>
    </IntroductionContainer>
  )
}
