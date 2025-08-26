import { motion as m } from "framer-motion"
import { styled } from "styled-components"

export const Container = styled(m.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  perspective: 93.75rem;
`

export const MainLayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
  perspective: 93.75rem;
  padding-bottom: 6rem;
`

export const CharactersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 80dvh;
  touch-action: none;
`

export const CharacterBox = styled(m.div)`
  width: 70dvw;
  height: 60dvh;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  cursor: ${(props) => (props.isSelected ? "grab" : "default")};
  overflow: hidden;

  &:active {
    cursor: ${(props) => (props.isSelected ? "grabbing" : "default")};
  }

  &.selected {
    z-index: 3;
  }

  &.left {
    transform-origin: center right;
  }

  &.right {
    transform-origin: center left;
  }
`

export const CharacterImage = styled(m.img)`
  width: auto;
  height: 80%;
  object-fit: contain;
  object-position: center;
  transition: filter 0.3s ease;
  position: relative;
  z-index: 2;
`

export const NavigationButton = styled(m.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 4.375rem;
  height: 4.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  cursor: pointer;
  filter: drop-shadow(0 0.25rem 0.9375rem rgba(0, 0, 0, 0.2));
  z-index: 10;
  color: #333;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.left {
    left: 1.875rem;
  }

  &.right {
    right: 1.875rem;
  }
`

export const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`

export const IntroContainer = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 5rem;
  width: 100%;
  height: 100dvh;
`

export const IntroCharactersRow = styled(m.div)`
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  gap: 1.25rem;
`

export const IntroCharacterItem = styled(m.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 25dvw;
  height: 50dvh;
  cursor: pointer;
  position: relative;
`

export const IntroCharacterImage = styled(m.img)`
  width: 15.1875rem;
  height: 27rem;
  aspect-ratio: 9/16;
  object-fit: contain;
`

export const CharacterButtonLayout = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 1000;
`
