# React Router Integration Guide

## High-Level Overview

The application now uses the React Router data APIs to drive the entire screen flow. Instead of keeping screen names inside component state, we declare a nested route tree and let the router own navigation, data prefetching, and error handling. Each screen exports a `loader` that guarantees the right slice of CMS content is available before the component renders. TanStack Query supplies caching and deduplication for CMS calls, and the router loaders hydrate that cache before React renders the route.

## Route Hierarchy

```
/
├── (root)                 → <Root /> layout
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
└── error boundary         → <AppLayout><ErrorPage /></ErrorPage>
```

- `Root` renders the global layout, modal handling, and mobile guard. Its loader ensures the CMS tree is fetched so children have content.
- `CharacterLayout` validates `:characterId`, sets the global `currentCharacterIndex`, and guards against unknown characters.
- Each leaf screen consumes loader data via `useLoaderData()` with no extra fetch calls when the cache is warm.

## Loader Pattern

Every route exposes a `loader` factory that accepts the shared `queryClient`. The pattern looks like this:

```js
export const loader =
  (queryClient) =>
  async ({ params }) => {
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

- A single `QueryClient` is created in `main.jsx` and shared with both loaders and the app via `QueryClientProvider`.
- Loaders seed the cache with `ensureQueryData` before React renders.
- Screen-level hooks (`useGalleryImages`, `useUploadImage`, etc.) still use TanStack Query for sections that rely on user state or mutations, complementing loader-provided CMS data.
- React Query Devtools remain available for debugging (`<ReactQueryDevtools />`).

## Navigation & Redirects

- `Navigate to="introduction" replace` ensures `/characters/:id` immediately redirects to the first step.
- Components use `useNavigate()` and URL paths (`navigate(/characters/${characterIndex}/perspective)`), keeping navigation declarative and URL-driven.
- Global state (`StateProvider`) still tracks non-route concerns (captured images, modal state).

## Error Handling & Hydration

- `Root` uses `errorElement` to render `<AppLayout><ErrorPage /></AppLayout>` when loaders throw.
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
