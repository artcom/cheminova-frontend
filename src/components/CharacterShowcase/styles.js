import styled from "styled-components"
import { motion } from "framer-motion"

export const Container = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  perspective: 1500px;
`

export const MainLayoutContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  perspective: 1500px;
  padding-bottom: 6rem; /* Space for navigation overlay */
`

export const CharactersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 80vh;
  touch-action: none;
`

export const CharacterBox = styled(motion.div)`
  width: 70vw;
  height: 60vh;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  cursor: ${(props) => (props.isSelected ? "grab" : "default")};
  overflow: hidden;

  @media (max-width: 768px) {
    width: 360px;
    height: 480px;
  }

  @media (max-width: 480px) {
    width: 360px;
    height: 480px;
  }

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
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  letter-spacing: 1px;
  position: relative;
`

export const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2));
  z-index: 10;
  color: #333;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &.left {
    left: 30px;
  }

  &.right {
    right: 30px;
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
  height: 90vh;
`

export const IntroCharactersRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`

export const IntroCharacterItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25vw;
  height: 50vh;
  cursor: pointer;
  position: relative;

  @media (max-width: 768px) {
    width: 30vw;
    height: 40vh;
  }

  @media (max-width: 480px) {
    width: 30vw;
    height: 35vh;
  }
`

export const IntroCharacterImage = styled(motion.img)`
  width: auto;
  height: 80%;
  object-fit: contain;
  object-position: center;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
`

export const IntroHeading = styled(motion.div)`
  text-align: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin-top: 30px;
  padding: 0 20px;
  max-width: 800px;
  line-height: 1.4;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
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
