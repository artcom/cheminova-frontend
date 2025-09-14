import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  /* Global reset & interaction tuning */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* CSS custom properties for safe areas & z-index scale */
  :root {
    --safe-inset-top: env(safe-area-inset-top, 0px);
    --safe-inset-bottom: env(safe-area-inset-bottom, 0px);
    --z-base: 0;
    --z-overlay: 10;
    --z-modal: 100;
  }

  html,
  body {
    background-color: ${(props) => props.theme.colors.background.dark};
    width: 100%;
    height: 100%;
    min-height: 100dvh; /* Support dynamic viewport on mobile browsers */
    overflow: hidden; /* Kiosk-style: lock scroll intentionally */
    color: ${(props) => props.theme.colors.text.primary};
    font-family: "Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-variation-settings: "wdth" 100;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    place-items: center;
  }

  input, textarea, select { font-family: inherit; }
`

export default GlobalStyles
