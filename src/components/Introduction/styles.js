import { styled } from "styled-components"
import { motion } from "framer-motion"
import IntroductionBackground from "./IntroductionBackground.png"

export const IntroductionContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-image: url(${IntroductionBackground});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`

export const CharacterImageContainer = styled.div`
  position: absolute;
  top: -20%;
  right: 0;
  width: 38.81438rem;
  height: 68.98613rem;
  transform: translateX(50%) rotate(-37.338deg);
  z-index: 1;
`

export const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const ContentContainer = styled(motion.div)`
  position: absolute;
  top: 31.3125rem;
  left: 50%;
  display: flex;
  width: 90%;
  height: 59.5625rem;
  padding: 1.75rem 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  flex-shrink: 0;
  border-radius: 1.75rem 1.75rem 0 0;
  background: #f1ece1;
  z-index: 2;
`

export const Headline = styled.h1`
  color: #000;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 94%;
  margin: 0;
`

export const TextBlock = styled.p`
  color: #000;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.01rem;
  height: 12.125rem;
  flex-shrink: 0;
  align-self: stretch;
  margin: 0;
  white-space: pre-line;
`

export const Image = styled.img`
  width: 18.4375rem;
  height: 13.4375rem;
  border-radius: 1.75rem;
`

export const CameraButtonContainer = styled.div`
  display: flex;
  height: 7.1875rem;
  padding: 1.75rem 0;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;
`
