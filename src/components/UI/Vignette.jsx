import { styled } from "styled-components"

const GradientWelcome = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 7.4375rem;
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
  left: 0;
  width: 100%;
  height: 25.25rem;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    179deg,
    rgba(31, 31, 31, 0) 0.68%,
    #1f1f1f 65.25%
  );
`

export default function Vignette() {
  return (
    <>
      <GradientWelcome />
      <GradientCharacter />
    </>
  )
}
