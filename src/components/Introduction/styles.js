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
    css`
      background-image: none;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: ${$backgroundImage
          ? `url(${$backgroundImage})`
          : "none"};
        background-size: 100% auto;
        background-position: center center;
        background-repeat: no-repeat;
        opacity: 0.5;
        pointer-events: none;
        z-index: 0;
      }
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
