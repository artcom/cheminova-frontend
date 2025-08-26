import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"
import useGlobalState from "@hooks/useGlobalState"
import { useEffect, useState } from "react"

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

export default function Introduction({ onNext }) {
  const { selectedCharacter, currentCharacterIndex } = useGlobalState()
  const [scrollY, setScrollY] = useState(0)

  const currentCharacter =
    selectedCharacter || CHARACTER_DATA[currentCharacterIndex]

  useEffect(() => {
    const handleScroll = (e) => {
      setScrollY(e.target.scrollTop)
    }

    const container = document.querySelector("[data-introduction-container]")
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <IntroductionContainer data-introduction-container>
      <CharacterImageContainer>
        <CharacterImage
          src={currentCharacter.selectedImage}
          alt={currentCharacter.name}
        />
      </CharacterImageContainer>

      <ContentContainer
        initial={{ x: "-50%", y: 0 }}
        animate={{ x: "-50%", y: -scrollY * 0.5 }}
        transition={{ type: "tween", ease: "linear" }}
      >
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
          <IconButton variant="camera" onClick={onNext} />
        </CameraButtonContainer>
      </ContentContainer>
    </IntroductionContainer>
  )
}
