import { styled } from "styled-components"

const VignetteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  background: ${({ $intensity, $isCharacterScreen }) => {
    if ($isCharacterScreen) {
      return "none"
    }
    return `linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.8) ${$intensity * 0.2}%,
      rgba(0, 0, 0, 0.7) ${$intensity * 0.4}%,
      rgba(0, 0, 0, 0.1) ${$intensity * 0.7}%,
      transparent ${$intensity}%,
      transparent ${100 - $intensity}%,
      rgba(0, 0, 0, 0.2) ${100 - $intensity * 0.7}%,
      rgba(0, 0, 0, 0.9) ${100 - $intensity * 0.4}%,
      rgba(0, 0, 0, 1) ${100 - $intensity * 0.2}%,
      rgba(0, 0, 0, 1) 100%
    )`
  }};
`

const GradientWelcome = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 11.4375rem;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0) 0.68%,
    rgba(0, 0, 0, 0.72) 46.21%,
    #1f1f1f 86.99%
  );
`

const GradientCharacter = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 18.25rem;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    179deg,
    rgba(31, 31, 31, 0) 0.68%,
    #1f1f1f 36.25%
  );
`

export default function Vignette({
  intensity = 25,
  isCharacterScreen = false,
}) {
  if (isCharacterScreen) {
    return (
      <>
        <GradientWelcome />
        <GradientCharacter />
      </>
    )
  }

  return (
    <VignetteContainer
      $intensity={intensity}
      $isCharacterScreen={isCharacterScreen}
    />
  )
}
