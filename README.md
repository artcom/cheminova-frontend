# Cheminova Frontend

An interactive, character-led storytelling experience that combines CMS-driven content, photo capture, and a 3D gallery. The app runs on the React Router framework stack with Vite, TanStack Query, styled-components, and i18next.

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.local.example .env
   # tweak values as needed
   ```

3. **Run the dev server** (Vite + React Router framework mode)

   ```bash
   npm run dev
   ```

   By default the app is served on <http://localhost:5173> with hot module reloading.

## Available scripts

| Command                           | Description                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                     | Starts the React Router dev server with Vite under the hood.                 |
| `npm run dev:host`                | Same as `dev`, but binds to all interfaces for device testing.               |
| `npm run build`                   | Framework build that emits the production bundle to `build/client`.          |
| `npm run preview`                 | Serves the already-built bundle via `vite preview`.                          |
| `npm run lint`                    | Runs ESLint (React, Hooks, TanStack Query, React Three rules) against `src`. |
| `npm run format` / `format:write` | Checks or writes formatting using Prettier + import sorting.                 |

Husky + lint-staged run `lint`/`prettier --write` on staged files before every commit.

## Environment variables

Only two environment switches are currently respected at runtime:

| Variable            | Purpose                                                                                                | Default                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Overrides the CMS API base URL consumed by `src/config/api.js`.                                        | `http://localhost:8080` in dev, `/cms/api` in production builds. |
| `VITE_BASE_PATH`    | Controls the public base path for the Vite build (useful when the app is hosted under a subdirectory). | `/`                                                              |

Copy `.env.local.example` or `.env.example`, uncomment the value you need, and restart the dev server after changes. Legacy `REACT_APP_*` flags are no longer read by the codebase and can be removed from your environment.

## Architecture at a glance

- **React Router framework mode** defines the entire route tree inside `src/routes.js`. Each entry references a route module (e.g., `src/routes/Root.jsx`, `src/routes/CharacterLayout.jsx`, or leaf screens under `src/components/*`).
- **Loaders before render**: Every route exports a `clientLoader` that prefetches CMS content via the shared `QueryClient` from `src/queryClient.js`. Components rely on `useLoaderData()` so that CMS slices are ready on first paint.
- **Shared providers** live in `src/root.jsx`, wrapping the app with `QueryClientProvider`, `LanguageProvider`, global state, theming, and global styles. The entry point (`src/entry.client.jsx`) hydrates everything with `<HydratedRouter />`.
- **CMS helpers** in `src/api/queries.js` and `src/utils/*` describe how to extract specific content sections (welcome, introduction, gallery, etc.) from the fetched tree.
- **i18n** uses `i18next` with locale files in `public/locales/*` and runtime detection configured in `src/i18n/index.js`.
- **3D + media** experiences (photo capture, gallery) live under `src/components/*` with scoped hooks inside `src/hooks/*` and shared UI building blocks in `src/components/UI` or `src/components/shared`.

## Data loading pattern

Typical loader implementation (simplified):

```js
import { extractFromContentTree } from "@/api/hooks"
import { loadCharacterSection } from "@/utils/loaderHelpers"

export async function clientLoader({ params }) {
  const {
    section: introduction,
    characterSlug,
    character,
  } = await loadCharacterSection(
    params,
    (content, characterIndex) =>
      extractFromContentTree.getIntroduction(content, characterIndex),
    { missingMessage: "Introduction data missing from CMS" },
  )

  return { characterSlug, character, introduction }
}
```

Key takeaways:

1. Loaders **validate params** and throw typed responses for React Router to surface in error boundaries.
2. `ensureQueryData` keeps TanStack Query as the single cache source; components never re-fetch the same CMS tree.
3. Child routes inherit data from parents through `useRouteLoaderData("parentId")`, so shared lookups (character metadata, modal state) live in one place.

### Loader helper utilities

The shared helpers in `src/utils/loaderHelpers.js` keep loaders tidy:

- `loadCmsContent({ locale? })` – hydrates the entire CMS tree (used by `Root`, `Welcome`, etc.).
- `loadCharacterContext(params, { locale?, content? })` – resolves the character slug from the URL and returns `{ characterSlug, characterIndex, character, characters, content, locale }`, throwing typed errors for invalid slugs or missing CMS nodes.
- `loadCharacterSection(params, extractor, { missingMessage?, missingStatus?, locale?, content? })` – builds on `loadCharacterContext`, runs your extractor (e.g., `getIntroduction`, `getGallery`), and throws automatically if the section is missing. The helper returns all character context fields plus `section` so loaders can stay concise.
- `requireContentSection(section, message, status?)` – lower-level guard exported in case a loader needs to validate extra CMS slices (e.g., `Ending` fetching both the ending and the closing reflection).

Prefer `loadCharacterSection` whenever a loader needs both the character context and a guaranteed CMS slice—it cuts ~10 lines per loader and standardises error responses.

## Directory highlights

```text
src/
├── api/                 # Fetch helpers, TanStack Query definitions, upload utils
├── components/          # Feature modules (Welcome, PhotoCapture, Gallery, etc.)
├── hooks/               # Reusable hooks consumed by components & loaders
├── providers/           # Context providers (CapturedImagesProvider, LanguageProvider)
├── routes/              # Route modules (Root layout, CharacterLayout, ErrorPage)
├── theme/               # styled-components theme + ThemeProvider
├── utils/               # CMS tree helpers, language utilities, preload helpers
└── entry.client.jsx     # Hydrates <HydratedRouter />
```

## Quality tooling

- **ESLint** (flat config) enforces React, Hooks, TanStack Query, and @react-three best practices.
- **Prettier** (with automatic import sorting) is required on save; use `npm run format:write` to fix formatting issues.
- **Husky** + **lint-staged** run lint/format against staged files to keep commits clean.

## Build & deploy reminders

1. Run `npm run build` to emit `build/client`. Clean the folder before committing; generated assets should remain untracked.
2. If the site is hosted under a subpath (e.g., `/chemisee/`), set `VITE_BASE_PATH=/chemisee/` before building.
3. Backends that expose the CMS outside `/cms/api` must override `VITE_API_BASE_URL` accordingly.

With the router owning navigation and loaders seeding the cache, feature work should focus on crafting route modules, keeping data derivations inside loaders, and letting components stay pure/presentational.
