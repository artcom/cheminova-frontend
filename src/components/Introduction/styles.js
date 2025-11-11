import { styled } from "styled-components"

export const IntroductionContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background-color: ${(props) => props.theme.colors.background.dark};
  background-image: ${(props) =>
    props.$backgroundImage ? `url(${props.$backgroundImage})` : "none"};
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
`

export const CharacterImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 53.25rem; /* ~852px */
  z-index: 1;
  pointer-events: none;
`

export const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
`

export const RiveAnimationContainer = styled.div`
  position: relative;
  width: 100%;
  height: 53.25rem; /* ~852px */
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
`

export const ContentScrollContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 2;
  padding: 0 1.625rem 2rem 1.625rem; /* 26px horizontal, 32px bottom */
  margin-top: -20.9375rem; /* Negative margin to overlap with character image */
`

export const ContentCard = styled.div`
  background: ${(props) => props.theme.colors.background.paper};
  border-radius: 1rem; /* 16px */
  padding: 2rem 1.5rem; /* 32px 24px */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 16px */
`

export const Headline = styled.h1`
  color: ${(props) => props.theme.colors.text.primary};
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 2.375rem; /* 38px */
  font-weight: 700;
  line-height: 2.875rem; /* 46px */
  letter-spacing: -0.0238rem; /* -0.38px */
  margin: 0;
  width: 100%;
  max-width: 15.5rem; /* 248px */
`

export const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0; /* 16px vertical */
  width: 100%;
`

export const Image = styled.img`
  width: 100%;
  max-width: 18.4375rem; /* 295px */
  height: auto;
  aspect-ratio: 295 / 309;
  object-fit: cover;
  border-radius: 0.75rem; /* 12px */
`

export const TextBlock = styled.p`
  color: ${(props) => props.theme.colors.text.primary};
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.375rem; /* 22px */
  margin: 0;
  white-space: pre-line;
`

export const CameraButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0 4rem 0; /* 48px top, 64px bottom */
  width: 100%;
`
