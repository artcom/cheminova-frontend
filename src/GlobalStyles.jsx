import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    background-color: rgba(255, 255, 255, 0.87);
    width: 100%;
    height: 100%;
    color: #242424;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

 
`

export default GlobalStyles
