import { motion as m } from "motion/react"
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
  overflow: hidden;

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
