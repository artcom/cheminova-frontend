import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "@components/App"
import GlobalStyles from "@/GlobalStyles"
import AppThemeProvider from "@theme/ThemeProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import StateProvider from "@/GlobalState"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StateProvider>
        <AppThemeProvider>
          <GlobalStyles />
          <App />
          <ReactQueryDevtools />
        </AppThemeProvider>
      </StateProvider>
    </QueryClientProvider>
  </StrictMode>,
)
