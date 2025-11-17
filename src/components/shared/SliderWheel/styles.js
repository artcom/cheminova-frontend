import { styled } from "styled-components"

export const cardPositions = [
  { x: "0px", y: "21.5rem", opacity: 1, zIndex: 2 },
  { x: "11rem", y: "19rem", opacity: 0.5, zIndex: 1 },
  { x: "-11rem", y: "19rem", opacity: 0.5, zIndex: 1 },
]

export const characterStyles = {
  janitor: {
    backgroundColor: "#f1ece1",
    textColor: "#000",
    imageBorder: "1px solid #000",
  },
  future: {
    backgroundColor: "#1f1f1f99",
    border: "1px solid #fff",
    textColor: "#ffffff",
  },
  artist: {
    backgroundColor: "#f1ece1",
    border: "1px solid #000",
    textColor: "#000",
  },
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  width: 19.25rem;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const SlideItem = styled.div`
  position: absolute;
  width: 16.3625rem;
  height: 20.93125rem;
  top: ${({ $y }) => $y};
  left: ${({ $x }) => `calc(50% + ${$x})`};
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1.625rem;
  border-radius: 1.75rem;
  transform: translate(-50%, -50%);
  opacity: ${({ opacity }) => opacity};
  z-index: ${({ $zIndex }) => $zIndex};
  background-color: ${({ $characterId }) =>
    characterStyles[$characterId]?.backgroundColor || "#f1ece1"};
  border: ${({ $characterId }) =>
    characterStyles[$characterId]?.border || "none"};
  transition:
    all 0.3s ease,
    opacity 0.3s ease;
`
