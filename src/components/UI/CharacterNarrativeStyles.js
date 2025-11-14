import { styled } from "styled-components"

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
  position: relative;
  width: 100%;
  height: 53.25rem;
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
  position: relative;
  width: 100%;
  height: 53.25rem;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
`

export const CharacterContentWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 2;
  padding: 0 1.625rem 2rem 1.625rem;
  margin-top: -20.9375rem;
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
  flex-direction: column;
  gap: 1rem;
  backdrop-filter: ${(props) =>
    props.$isFuturePerson ? "blur(10px)" : "none"};
  -webkit-backdrop-filter: ${(props) =>
    props.$isFuturePerson ? "blur(10px)" : "none"};
  background-image: ${(props) =>
    props.$isArtist
      ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' viewBox='0 0 700 700' width='700' height='700' opacity='1'%3E%3Cdefs%3E%3Cfilter id='nnnoise-filter' x='-20%25' y='-20%25' width='140%25' height='140%25' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='linearRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.067' numOctaves='4' seed='15' stitchTiles='stitch' x='0%25' y='0%25' width='100%25' height='100%25' result='turbulence'%3E%3C/feTurbulence%3E%3CfeSpecularLighting surfaceScale='12' specularConstant='3' specularExponent='20' lighting-color='%238b572a' x='0%25' y='0%25' width='100%25' height='100%25' in='turbulence' result='specularLighting'%3E%3CfeDistantLight azimuth='3' elevation='128'%3E%3C/feDistantLight%3E%3C/feSpecularLighting%3E%3C/filter%3E%3C/defs%3E%3Crect width='700' height='700' fill='%23f1ece1ff'%3E%3C/rect%3E%3Crect width='700' height='700' fill='%238b572a' filter='url(%23nnnoise-filter)'%3E%3C/rect%3E%3C/svg%3E\")"
      : "none"};
`

export const CharacterHeadline = styled.h1`
  color: ${(props) =>
    props.$isFuturePerson ? "#FFFFFF" : props.theme.colors.text.primary};
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1.575rem;
  font-weight: 700;
  line-height: 2.875rem;
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

export const CharacterText = styled.p`
  color: ${(props) =>
    props.$isFuturePerson ? "#FFFFFF" : props.theme.colors.text.primary};
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375rem;
  margin: 0;
  white-space: pre-line;
`

export const CharacterActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) =>
    props.$isCompact ? "2rem 0 2.5rem 0" : "3rem 0 4rem 0"};
  width: 100%;
`
