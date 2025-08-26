import StateProvider from "@/GlobalState"
import GlobalStyles from "@/GlobalStyles"
import App from "@components/App"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppThemeProvider from "@theme/ThemeProvider"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

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
