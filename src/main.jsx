import StateProvider from "@/GlobalState"
import GlobalStyles from "@/GlobalStyles"
import LanguageProvider from "@/providers/LanguageProvider"
import CharacterLayout, {
  loader as characterLoader,
} from "@/routes/CharacterLayout"
import ErrorPage from "@/routes/ErrorPage"
import Root, { AppLayout, loader as rootLoader } from "@/routes/Root"
import Ending, { loader as endingLoader } from "@components/Ending"
import Exploration, {
  loader as explorationLoader,
} from "@components/Exploration"
import Gallery, { loader as galleryLoader } from "@components/Gallery"
import Introduction, {
  loader as introductionLoader,
} from "@components/Introduction"
import Perspective, {
  loader as perspectiveLoader,
} from "@components/Perspective"
import PhotoCapture, {
  loader as photoCaptureLoader,
} from "@components/PhotoCapture"
import Upload, { loader as uploadLoader } from "@components/Upload"
import Welcome, { loader as welcomeLoader } from "@components/Welcome"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppThemeProvider from "@theme/ThemeProvider"
import { StrictMode, Suspense } from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

// Initialize i18n
import "@/i18n"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    id: "root",
    element: <Root />,
    loader: rootLoader(queryClient),
    errorElement: (
      <AppLayout>
        <ErrorPage />
      </AppLayout>
    ),
    children: [
      {
        index: true,
        id: "welcome",
        loader: welcomeLoader(queryClient),
        element: <Welcome />,
      },
      {
        path: "characters/:characterId",
        id: "character",
        loader: characterLoader(queryClient),
        element: <CharacterLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="introduction" replace />,
          },
          {
            path: "introduction",
            loader: introductionLoader(queryClient),
            element: <Introduction />,
          },
          {
            path: "photo-capture",
            loader: photoCaptureLoader(queryClient),
            element: <PhotoCapture />,
          },
          {
            path: "exploration",
            loader: explorationLoader(queryClient),
            element: <Exploration />,
          },
          {
            path: "perspective",
            loader: perspectiveLoader(queryClient),
            element: <Perspective />,
          },
          {
            path: "upload",
            loader: uploadLoader(queryClient),
            element: <Upload />,
          },
          {
            path: "gallery",
            loader: galleryLoader(queryClient),
            element: <Gallery />,
          },
          {
            path: "ending",
            loader: endingLoader(queryClient),
            element: <Ending />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
