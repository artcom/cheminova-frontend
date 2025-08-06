import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    touch-action: manipulation;
    font-family: ${(props) => props.theme.fontFamily};
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none; 
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body {
    background-color: ${(props) => props.theme.colors.background.paper};
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: ${(props) => props.theme.colors.text.primary};
    font-family: ${(props) => props.theme.fontFamily};
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

  input, textarea, select {
    font-family: inherit;
  }

`

export default GlobalStyles
