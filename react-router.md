# React Router Integration Guide

## High-Level Overview

The application now runs on the React Router framework stack with the Vite plugin. Instead of keeping screen names inside component state, we declare a nested route map in `src/routes.js` and let the router own navigation, data prefetching, and error handling. Each screen exports a `clientLoader` that guarantees the right slice of CMS content is available before the component renders. TanStack Query supplies caching and deduplication for CMS calls, and the loaders hydrate that cache before React renders the route.

- Route modules live next to their UI (for example `src/components/Welcome/Welcome.jsx`) and export `default` + `clientLoader` (and optional `id`, `ErrorBoundary`, etc.).
- `src/routes.js` is the single place where the nested route hierarchy is declared using `route()`/`index()` helpers from `@react-router/dev/routes`.
- `src/root.jsx` hosts the HTML shell plus all global providers (`QueryClientProvider`, `LanguageProvider`, `StateProvider`, `AppThemeProvider`, global styles, etc.).
- `src/entry.client.jsx` boots the app with `<HydratedRouter />`, so there is no manual `createBrowserRouter` or `<RouterProvider>` setup anymore.
- `src/queryClient.js` owns the singleton `QueryClient`, ensuring loaders and the React tree share the same cache instance.

## Route Hierarchy

```
/
├── (root layout)          → src/routes/Root.jsx
│   ├── index              → <Welcome />
│   └── characters/:id     → <CharacterLayout />
│       ├── index          → Redirect → introduction
│       ├── introduction   → <Introduction />
│       ├── photo-capture  → <PhotoCapture />
│       ├── exploration    → <Exploration />
│       ├── perspective    → <Perspective />
│       ├── upload         → <Upload />
│       ├── gallery        → <Gallery />
│       └── ending         → <Ending />
└── error boundary         → Root route `ErrorBoundary` wrapping `<ErrorPage />`
```

- `Root` renders the global layout, modal handling, and mobile guard. Its loader ensures the CMS tree is fetched so children have content.
- `CharacterLayout` validates `:characterId`, sets the global `currentCharacterIndex`, and guards against unknown characters.
- Each leaf screen consumes loader data via `useLoaderData()` with no extra fetch calls when the cache is warm.

## Loader Pattern

Every route exposes a `clientLoader` that reads the shared `QueryClient` from `src/queryClient.js` and prefetches CMS data before React renders the component:

```js
import { queryClient } from "@/queryClient"

export async function clientLoader({ params }) {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)
  // ...derive content for this route...
  return { characterIndex, introduction }
}
```

Key details:

- **Locale-aware**: `getCurrentLocale()` now safely normalises the current language (no more `.trim()` on `undefined`).
- **Shared query options**: `allContentQuery(locale)` returns the canonical query config for the entire CMS tree, so every loader hits the same cache entry.
- **Prefetch via `ensureQueryData`**: If the data exists, React Query returns it synchronously; otherwise it fetches and caches before React renders the route element.
- **Validation**: Loaders throw `new Response("Character not found", { status: 404 })` when params are invalid, letting React Router surface the 404 within our error boundary.

## Loader Data Consumption

Components read loader data only through `useLoaderData()` or (for nested components under `Welcome`) `useRouteLoaderData("welcome")`. Examples:

- `Introduction` receives `{ characterIndex, character, introduction }` and renders synchronised content.
- `PhotoCapture` uses loader data for `photography` task metadata while local state tracks captured images.
- `Gallery` combines loader content (headings/buttons) with TanStack query data for uploaded pictures.

No component calls `useAllContent()` directly anymore, eliminating duplicate fetches.

## TanStack Query + Router

- A single `QueryClient` lives in `src/queryClient.js` and is imported both by loaders and by the `QueryClientProvider` wrapper inside `src/root.jsx`.
- Loaders seed the cache with `ensureQueryData` before React renders.
- Screen-level hooks (`useGalleryImages`, `useUploadImage`, etc.) still use TanStack Query for sections that rely on user state or mutations, complementing loader-provided CMS data.
- React Query Devtools remain available for debugging (`<ReactQueryDevtools />`).

## Navigation & Redirects

- `Navigate to="introduction" replace` ensures `/characters/:id` immediately redirects to the first step.
- Components use `useNavigate()` and URL paths (`navigate(/characters/${characterIndex}/perspective)`), keeping navigation declarative and URL-driven.
- Global state (`StateProvider`) still tracks non-route concerns (captured images, modal state).

## Error Handling & Hydration

- `Root` exports an `ErrorBoundary` that wraps `<ErrorPage />` in `<AppLayout>` so any loader errors surface with the full layout shell.
- The framework manages hydration through `<HydratedRouter />`, so there is no manual `<RouterProvider>` fallback element anymore.
- `ErrorPage` now displays stack traces in a `<pre>` outside the `<p>`, avoiding hydration warnings.
- `RouterProvider` is configured with both `fallbackElement={null}` and `hydrateFallbackElement={<></>}` to satisfy React Router’s hydration requirements alongside our Suspense fallback.

## Welcome Screen Sharing

`Welcome` loader returns `{ welcome, characterOverview, characters }`. Nested components (`CharacterShowcase`, `CharacterCarousel`, `Intro`) read that data via `useLoaderData()` / `useRouteLoaderData("welcome")`, so they render instantly without issuing new requests, yet still react to global state updates.

## Mutations & Upload Flow

- `useUploadImage` still uses its own query/mutation because it deals with user-generated uploads, not static CMS content. It reads the current character from route params and invalidates image queries on success.

## What Changed Conceptually

1. **URL-driven state**: Character and screen progression reflect in the URL, enabling deep linking and back/forward support.
2. **Data preloading**: Loaders and TanStack Query cooperate so each screen has its CMS slice ready before render.
3. **Safer locale management**: New helpers guard against invalid language codes and fall back gracefully.
4. **Improved error UX**: Proper error boundary layout and hydration-safe markup.
5. **Hydration configuration**: Explicit fallback elements prevent runtime warnings while keeping initial render blank.

This structure provides a foundation for extending the flow (e.g., adding new child routes or data loaders) while keeping CMS access centralised and cached. For new screens, follow the same loader pattern: validate params, call `ensureQueryData`, extract the required subtree with `extractFromContentTree`, and return those slices for `useLoaderData()` to consume.

## Build & Preview Commands

- `npm run dev` → `react-router dev` (Vite-powered dev server with file watching)
- `npm run build` → `react-router build` (emits static assets into `build/client`)
- `npm run preview` → `vite preview --outDir build/client` (serves the production bundle after a successful build)
