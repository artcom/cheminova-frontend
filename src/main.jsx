import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import GlobalStyles from "./GlobalStyles"
import StateProvider from "./GlobalState"

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StateProvider>
      <GlobalStyles />
      <App />
    </StateProvider>
  </StrictMode>,
)
