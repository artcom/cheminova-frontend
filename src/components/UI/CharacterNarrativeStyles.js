import { styled } from "styled-components"

import PaperTexture from "./assets/paperTexture.jpg"
import { richTextStyles } from "./richTextStyles"

export const CharacterNarrativeContainer = styled.div`
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

export const CharacterMediaContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 1;
  pointer-events: none;
`

export const CharacterMediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
`

export const CharacterRiveContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
`

export const CharacterContentWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 2;
  padding: 0 1.625rem 2rem 1.625rem;
  margin-top: -00.9375rem;
`

export const CharacterContentCard = styled.div`
  background: ${(props) =>
    props.$isFuturePerson
      ? "rgba(31, 31, 31, 0.60)"
      : props.theme.colors.background.paper};
  border-radius: ${(props) =>
    props.$isFuturePerson ? "1rem 1rem 1rem 1rem" : "1rem"};
  border: ${(props) => {
    if (props.$isFuturePerson) return "1px solid #FFF"
    if (props.$isJanitor) return "1px solid #000"
    return "none"
  }};
  padding: 2rem 1.5rem;
  display: flex;
  margin-top: 38rem;
  flex-direction: column;
  gap: 1rem;
  backdrop-filter: ${(props) =>
    props.$isFuturePerson ? "blur(10px)" : "none"};
  -webkit-backdrop-filter: ${(props) =>
    props.$isFuturePerson ? "blur(10px)" : "none"};
  background-image: ${(props) =>
    props.$isArtist ? `url(${PaperTexture})` : "none"};
  background-size: 512px 512px;
  background-position: top left;
  background-repeat: repeat;
`

export const CharacterHeadline = styled.h1`
  color: ${(props) =>
    props.$isFuturePerson ? "#FFFFFF" : props.theme.colors.text.primary};
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1.575rem;
  font-weight: 700;
  line-height: 1.25rem;
  letter-spacing: -0.0238rem;
  margin: 0;
  width: 100%;
  max-width: 100%;
  text-decoration: ${(props) => (props.$isJanitor ? "underline" : "none")};
`

export const CharacterImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  width: 100%;
`

export const CharacterContentImage = styled.img`
  width: 100%;
  max-width: 18.4375rem;
  height: auto;
  aspect-ratio: 295 / 309;
  object-fit: cover;
  border-radius: 0.75rem;
  border: ${(props) => (props.$isJanitor ? "1px solid #000" : "none")};
`

export const CharacterText = styled.div`
  color: ${(props) =>
    props.$isFuturePerson ? "#FFFFFF" : props.theme.colors.text.primary};
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375rem;
  margin: 0;

  ${richTextStyles}
`

export const CharacterActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) =>
    props.$isCompact ? "2rem 0 2.5rem 0" : "3rem 0 4rem 0"};
  width: 100%;
`
