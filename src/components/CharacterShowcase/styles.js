import styled from "styled-components"
import { motion } from "framer-motion"

export const Container = styled(motion.div)`
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

export const MainLayoutContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
  perspective: 93.75rem;
  padding-bottom: 6rem; /* Space for navigation overlay */
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

export const CharacterBox = styled(motion.div)`
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

export const CharacterImage = styled(motion.img)`
  width: auto;
  height: 80%;
  object-fit: contain;
  object-position: center;
  transition: filter 0.3s ease;
  position: relative;
  z-index: 2;
`

export const CharacterName = styled(motion.div)`
  width: 100%;
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.3);
  margin-top: 1.25rem;
  letter-spacing: 0.0625rem;
  position: relative;
`

export const NavigationButton = styled(motion.button)`
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

export const Particle = styled(motion.div)`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  pointer-events: none;
`

export const IntroContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90dvh;
`

export const IntroCharactersRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`

export const IntroCharacterItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25dvw;
  height: 50dvh;
  cursor: pointer;
  position: relative;
`

export const IntroCharacterImage = styled(motion.img)`
  width: auto;
  height: 80%;
  object-fit: contain;
  object-position: center;
  filter: drop-shadow(0 0.625rem 0.9375rem rgba(0, 0, 0, 0.3));
`

export const IntroHeading = styled(motion.div)`
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.3);
  margin-top: 1.875rem;
  padding: 0 1.25rem;
  max-width: 50rem;
  line-height: 1.4;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const CharacterButtonLayout = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 1000;
`
