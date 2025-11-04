import { styled } from "styled-components"

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100dvw;
  height: 100dvh;
  /* Safe area padding for devices with notches */
  padding-top: var(--safe-inset-top);
  padding-bottom: var(--safe-inset-bottom);
  background: ${({ theme, $backgroundImage }) =>
    `${theme.colors.background.dark} url(${$backgroundImage}) center / cover no-repeat`};
  /* If large background images cause repaints during scroll (not expected in kiosk),
     consider: background-attachment: local; or further optimization via preloading. */
  position: relative; /* Removed absolute: rely on root grid centering */
`

export const TextLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 24.5625rem;
  margin: 0 auto;
  padding: 0 1rem; /* Prevent edge clipping on narrower screens */
  justify-content: ${({ $hasDescription }) =>
    $hasDescription ? "space-between" : "flex-start"};
  align-items: flex-start;
  flex: 1 0 auto;
`

export const ChildrenContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100dvw;
  height: 100dvh;
  /* Layering note: This acts as an overlay (character carousel / animations).
     If it ever blocks underlying interactive text unintentionally,
     you can enable pass-through: pointer-events: none; and re-enable
     on specific interactive descendants with pointer-events: auto. */
`

export const LanguageSelectorContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
`
