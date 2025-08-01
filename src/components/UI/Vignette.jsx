import { styled } from "styled-components"

const VignetteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.8) ${({ $intensity }) => $intensity * 0.2}%,
    rgba(0, 0, 0, 0.7) ${({ $intensity }) => $intensity * 0.4}%,
    rgba(0, 0, 0, 0.1) ${({ $intensity }) => $intensity * 0.7}%,
    transparent ${({ $intensity }) => $intensity}%,
    transparent ${({ $intensity }) => 100 - $intensity}%,
    rgba(0, 0, 0, 0.2) ${({ $intensity }) => 100 - $intensity * 0.7}%,
    rgba(0, 0, 0, 0.9) ${({ $intensity }) => 100 - $intensity * 0.4}%,
    rgba(0, 0, 0, 1) ${({ $intensity }) => 100 - $intensity * 0.2}%,
    rgba(0, 0, 0, 1) 100%
  );
`

export default function Vignette({ intensity = 25 }) {
  return <VignetteContainer $intensity={intensity} />
}
