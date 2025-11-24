import { styled } from "styled-components"

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100dvw;
  height: 100dvh;
  padding-top: 0;
  padding-bottom: var(--safe-inset-bottom);
  background: ${({ theme, $backgroundImage }) =>
    $backgroundImage
      ? `${theme.colors.background.dark} url(${$backgroundImage}) center / cover no-repeat`
      : theme.colors.background.dark};
  position: relative;
`

export const TextLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  padding: 0 1rem;
  justify-content: ${({ $hasDescription }) =>
    $hasDescription ? "space-between" : "flex-start"};
  align-items: center;
  flex: 1 0 auto;
  /* Ensure a minimum height to prevent layout shifts during transitions */
  min-height: 50vh;
  position: relative;
  z-index: 2;
  pointer-events: none;
`

export const ChildrenContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  z-index: 0;
`

export const LayersContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  height: auto;
  pointer-events: none;
  z-index: 1;
  will-change: transform;
`

export const LayerImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 50%;
  height: auto;
  width: auto;
  max-width: none;
  will-change: transform, opacity;
`
