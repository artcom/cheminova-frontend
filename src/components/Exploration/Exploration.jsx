import useGlobalState from "@/hooks/useGlobalState"
import { CHARACTER_DATA } from "@components/Welcome/CharacterShowcase/constants"
import { useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { styled } from "styled-components"

import Navigation from "../UI/Navigation"
import FirstImage from "./1stImage.png"
import SecondImage from "./2ndImage.png"
import {
  CharacterImage,
  CharacterImageContainer,
  ContentContainer,
  Headline,
  Image,
  IntroductionContainer,
  TextBlock,
} from "./styles"

const StyledNavigation = styled(Navigation)`
  bottom: 10%;
`

export default function Exploration({ goToPerspective }) {
  const { currentCharacterIndex } = useGlobalState()
  const containerRef = useRef(null)
  const { scrollY } = useScroll({ container: containerRef })
  const y = useTransform(scrollY, (v) => -v * 0.5)

  const currentCharacter = CHARACTER_DATA[currentCharacterIndex]

  return (
    <IntroductionContainer data-introduction-container ref={containerRef}>
      <CharacterImageContainer>
        <CharacterImage src={currentCharacter.selectedImage} />
      </CharacterImageContainer>

      <ContentContainer initial={{ x: "-50%" }} style={{ y }}>
        <Headline>Look, what I’ve found,</Headline>

        <Image src={FirstImage} />

        <TextBlock>
          Stones with lots of tiny pores (like limestone), frequently found in
          ancient monuments are more vulnerable to corrosion because they act
          like little sponges!
        </TextBlock>

        <TextBlock>
          These porous stones absorb moisture, pollutants, and even acidic rain
          more easily than denser stones, this mechanism speeds up weathering.
        </TextBlock>

        <Image src={SecondImage} />

        <TextBlock>
          So, while a monument may look strong and solid, if it’s made of porous
          stone, it’s actually fighting a secret battle everyday!
        </TextBlock>

        <StyledNavigation
          mode="single"
          onSelect={goToPerspective}
          iconColor="black"
        />
      </ContentContainer>
    </IntroductionContainer>
  )
}
