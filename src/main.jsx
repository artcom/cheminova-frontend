import StateProvider from "@/GlobalState"
import GlobalStyles from "@/GlobalStyles"
import LanguageProvider from "@/providers/LanguageProvider"
import { queryClient } from "@/queryClient"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppThemeProvider from "@theme/ThemeProvider"
import { StrictMode, Suspense } from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

// Initialize i18n
import "@/i18n"

const queryClientInstance = queryClient ?? new QueryClient()

function convert(module) {
  const {
    clientLoader,
    clientAction,
    default: Component,
    ErrorBoundary,
    HydrateFallback,
    PendingComponent,
    shouldRevalidate,
    clientShouldRevalidate,
    handle,
    id,
    links,
    meta,
    headers,
  } = module

  const route = {}

  if (Component) route.Component = Component
  if (clientLoader) route.loader = clientLoader
  else if (module.loader) route.loader = module.loader
  if (clientAction) route.action = clientAction
  else if (module.action) route.action = module.action
  if (ErrorBoundary) route.ErrorBoundary = ErrorBoundary
  if (HydrateFallback) route.HydrateFallback = HydrateFallback
  if (PendingComponent) route.PendingComponent = PendingComponent

  const revalidate = clientShouldRevalidate ?? shouldRevalidate
  if (typeof revalidate !== "undefined") {
    route.shouldRevalidate = revalidate
  }

  if (typeof handle !== "undefined") route.handle = handle
  if (typeof id !== "undefined") route.id = id
  if (typeof links !== "undefined") route.links = links
  if (typeof meta !== "undefined") route.meta = meta
  if (typeof headers !== "undefined") route.headers = headers

  return route
}

const router = createBrowserRouter([
  {
    lazy: () => import("@/routes/Root").then(convert),
    children: [
      {
        index: true,
        lazy: () => import("@components/Welcome/Welcome").then(convert),
      },
      {
        path: "characters/:characterId",
        lazy: () => import("@/routes/CharacterLayout").then(convert),
        children: [
          {
            index: true,
            element: <Navigate to="introduction" replace />,
          },
          {
            path: "introduction",
            lazy: () =>
              import("@components/Introduction/Introduction").then(convert),
          },
          {
            path: "photo-capture",
            lazy: () =>
              import("@components/PhotoCapture/PhotoCapture").then(convert),
          },
          {
            path: "exploration",
            lazy: () =>
              import("@components/Exploration/Exploration").then(convert),
          },
          {
            path: "perspective",
            lazy: () =>
              import("@components/Perspective/Perspective").then(convert),
          },
          {
            path: "upload",
            lazy: () => import("@components/Upload/Upload").then(convert),
          },
          {
            path: "gallery",
            lazy: () => import("@components/Gallery/Gallery").then(convert),
          },
          {
            path: "ending",
            lazy: () => import("@components/Ending/Ending").then(convert),
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClientInstance}>
      <LanguageProvider>
        <StateProvider>
          <AppThemeProvider>
            <GlobalStyles />
            <Suspense fallback={null}>
              <RouterProvider
                router={router}
                fallbackElement={null}
                hydrateFallbackElement={<></>}
              />
              <ReactQueryDevtools />
            </Suspense>
          </AppThemeProvider>
        </StateProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
