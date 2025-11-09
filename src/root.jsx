import StateProvider from "@/GlobalState"
import GlobalStyles from "@/GlobalStyles"
import LanguageProvider from "@/providers/LanguageProvider"
import { queryClient } from "@/queryClient"
import riveWasmUrl from "@rive-app/canvas/rive.wasm?url"
import { RuntimeLoader } from "@rive-app/react-canvas"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppThemeProvider from "@theme/ThemeProvider"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

// Initialize i18n
import "@/i18n"

import LoadingSpinner from "@ui/LoadingSpinner"

// Configure Rive WASM
RuntimeLoader.setWasmUrl(riveWasmUrl)

export const meta = () => [
  { charSet: "utf-8" },
  { title: "Cheminova" },
  {
    name: "viewport",
    content:
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  },
]

export const links = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
]

export function Layout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <noscript>
          This application requires JavaScript to run. Please enable JavaScript
          in your browser and try again.
        </noscript>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StateProvider>
          <AppThemeProvider>
            <GlobalStyles />
            <Outlet />
            {import.meta.env.DEV ? <ReactQueryDevtools /> : null}
          </AppThemeProvider>
        </StateProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export function HydrateFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundColor: "#0b0b0b",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <LoadingSpinner size="48px" />
    </div>
  )
}
