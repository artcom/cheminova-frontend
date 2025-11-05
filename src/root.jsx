import StateProvider from "@/GlobalState"
import GlobalStyles from "@/GlobalStyles"
import LanguageProvider from "@/providers/LanguageProvider"
import { queryClient } from "@/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppThemeProvider from "@theme/ThemeProvider"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import LoadingSpinner from "@ui/LoadingSpinner"

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
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        minHeight: "100vh",
        backgroundColor: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Bricolage Grotesque, sans-serif",
      }}
    >
      <LoadingSpinner size="32px" text="Loading the experience..." />
      <p style={{ margin: 0, fontSize: "1rem", opacity: 0.9 }}>
        Preparing content—hang tight!
      </p>
    </div>
  )
}
