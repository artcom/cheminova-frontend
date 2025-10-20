import StateProvider from "@/GlobalState"
import GlobalStyles from "@/GlobalStyles"
import LanguageProvider from "@/providers/LanguageProvider"
import App from "@components/App"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppThemeProvider from "@theme/ThemeProvider"
import { StrictMode, Suspense } from "react"
import ReactDOM from "react-dom/client"

// Initialize i18n
import "@/i18n"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StateProvider>
          <AppThemeProvider>
            <GlobalStyles />
            <Suspense fallback={null}>
              <App />
              <ReactQueryDevtools />
            </Suspense>
          </AppThemeProvider>
        </StateProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
