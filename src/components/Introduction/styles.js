import { css, styled } from "styled-components"

import {
  CharacterActionContainer as CameraButtonContainer,
  CharacterMediaImage as CharacterImage,
  CharacterMediaContainer as CharacterImageContainer,
  CharacterContentCard as ContentCard,
  CharacterContentWrapper as ContentScrollContainer,
  CharacterHeadline as Headline,
  CharacterContentImage as Image,
  CharacterImageWrapper as ImageWrapper,
  CharacterNarrativeContainer as IntroductionContainerBase,
  CharacterRiveContainer as RiveAnimationContainer,
  CharacterText as TextBlock,
} from "@ui/CharacterNarrativeStyles"

export const IntroductionContainer = styled(IntroductionContainerBase)`
  ${({ $isJanitor, $backgroundImage }) =>
    $isJanitor &&
    $backgroundImage &&
    css`
      background-image:
        linear-gradient(rgba(31, 31, 31, 0.5), rgba(31, 31, 31, 0.5)),
        url(${$backgroundImage});
    `}
`

export {
  CameraButtonContainer,
  CharacterImage,
  CharacterImageContainer,
  ContentCard,
  ContentScrollContainer,
  Headline,
  Image,
  ImageWrapper,
  RiveAnimationContainer,
  TextBlock,
}
