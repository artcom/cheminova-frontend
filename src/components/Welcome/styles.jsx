import { styled } from "styled-components"

export const Layout = styled.div`
  display: flex;
  width: 100dvw;
  height: 100dvh;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  background-color: ${({ theme }) => theme.colors.background.dark};
  background-image: ${({ $backgroundImage }) => `url(${$backgroundImage})`};
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
`

export const TextLayout = styled.div`
  display: flex;
  width: 24.5625rem;
  margin: 0 auto;
  flex-direction: column;
  justify-content: ${({ $hasDescription }) =>
    $hasDescription ? "space-between" : "flex-start"};
  align-items: flex-start;
  gap: 0;
  flex: 1 0 0;
`

export const ChildrenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  z-index: 1;
`
