# React Router Framework Mode Guide for Beginners

## Table of Contents

1. [What is React Router Framework Mode?](#what-is-react-router-framework-mode)
2. [Why Framework Mode?](#why-framework-mode)
3. [Overview of This Application](#overview-of-this-application)
4. [Core Concepts](#core-concepts)
5. [The Building Blocks](#the-building-blocks)
6. [How Data Flows](#how-data-flows)
7. [File-by-File Breakdown](#file-by-file-breakdown)
8. [Complete Flow Example](#complete-flow-example)
9. [Key Patterns to Remember](#key-patterns-to-remember)

---

## What is React Router Framework Mode?

React Router has **three modes** of operation:

1. **Declarative Mode** - Basic routing with `<BrowserRouter>` (simplest, least features)
2. **Data Mode** - Adds data loading with `createBrowserRouter` (middle ground)
3. **Framework Mode** - Full-featured with Vite plugin integration (most powerful)

**Framework Mode** wraps Data Mode with a Vite plugin to provide:

- ✅ **Type-safe routing** - Routes are defined in code, not JSX
- ✅ **Intelligent code splitting** - Automatic lazy loading of route components
- ✅ **Server-side rendering (SSR) support** - Can render on server or client
- ✅ **Data preloading** - Fetch data before components render
- ✅ **File-based conventions** - Loaders, error boundaries, and more per route

Think of it as **Next.js-style routing for React**, but with React Router's philosophy.

---

## Why Framework Mode?

### Before Framework Mode (Problems)

- Manual state management for screen transitions
- Components fetching their own data (slower, duplicated requests)
- No URL-based deep linking
- Browser back/forward buttons don't work naturally
- Hard to preload data before rendering

### With Framework Mode (Solutions)

- **URL owns navigation state** - `/characters/0/introduction` is self-descriptive
- **Data loads before render** - Loaders fetch data, then React renders
- **Automatic code splitting** - Each route loads only when needed
- **Deep linking works** - Share URLs that go directly to any screen
- **Browser navigation works** - Back/forward buttons work automatically

---

## Overview of This Application

### The User Journey

```
Welcome Screen (Choose Character)
         ↓
    Introduction
         ↓
   Photo Capture (Take Photos)
         ↓
    Exploration (View Content)
         ↓
    Perspective (Reflection)
         ↓
      Upload (Submit Photos)
         ↓
    Gallery (3D Photo Gallery)
         ↓
      Ending (Thank You)
```

### How URLs Map to Screens

| Screen        | URL                           | Route Component    |
| ------------- | ----------------------------- | ------------------ |
| Welcome       | `/`                           | `Welcome.jsx`      |
| Introduction  | `/characters/0/introduction`  | `Introduction.jsx` |
| Photo Capture | `/characters/0/photo-capture` | `PhotoCapture.jsx` |
| Exploration   | `/characters/0/exploration`   | `Exploration.jsx`  |
| Perspective   | `/characters/0/perspective`   | `Perspective.jsx`  |
| Upload        | `/characters/0/upload`        | `Upload.jsx`       |
| Gallery       | `/characters/0/gallery`       | `Gallery.jsx`      |
| Ending        | `/characters/0/ending`        | `Ending.jsx`       |

**Note**: The `0` in the URL is the character index (0, 1, 2, etc.) which changes based on which character the user selected.

---

## Core Concepts

### 1. Routes Configuration (`src/routes.js`)

This is the **single source of truth** for all routes in the app. It uses React Router's route definition helpers:

- `route(path, file, children)` - Defines a route with optional nested children
- `index(file)` - Defines an index route (the default child)

```javascript
import { index, route } from "@react-router/dev/routes"

export default [
  route("/", "./routes/Root.jsx", [
    index("./components/Welcome/Welcome.jsx"),
    route("characters/:characterId", "./routes/CharacterLayout.jsx", [
      index("./routes/CharacterIndex.jsx"),
      route("introduction", "./components/Introduction/Introduction.jsx"),
      // ... more routes
    ]),
  ]),
]
```

**Key Points:**

- Routes are nested arrays (parent → children)
- `:characterId` is a **URL parameter** (dynamic value)
- Index routes render when parent path matches exactly

---

### 2. Loaders (Data Fetching Before Render)

Every route component can export a `clientLoader` function:

```javascript
export async function clientLoader({ params }) {
  // 1. Fetch data from API or cache
  // 2. Validate params
  // 3. Return data to component
  const data = await fetchData(params.characterId)
  return { data }
}
```

**What happens:**

1. User navigates to route (e.g., clicks a button)
2. React Router calls `clientLoader`
3. Loader fetches/validates data
4. Data is returned
5. Component renders with `useLoaderData()`

**Why this is powerful:**

- No loading spinners in components (data is ready)
- No duplicate API calls (loaders run once)
- Can throw errors to trigger error boundaries

---

### 3. Layout Routes (Shared UI)

Some routes exist just to wrap children with common UI or logic:

```javascript
// CharacterLayout.jsx wraps all character screens
export default function CharacterLayout() {
  return <Outlet /> // Renders child route
}
```

**Purpose:**

- Validate character ID once (all children inherit validation)
- Share UI elements (headers, footers, sidebars)
- Provide common layout structure

**Note:** Character index is passed to children via loader data, not global state.

---

### 4. The Root Route (Global Shell)

`root.jsx` is special - it wraps the **entire app**:

```javascript
export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StateProvider>
          <AppThemeProvider>
            <GlobalStyles />
            <Outlet /> {/* All routes render here */}
          </AppThemeProvider>
        </StateProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
```

**Also exports:**

- `Layout` - HTML `<head>` and `<body>` structure
- `meta` - Page title, viewport, etc.
- `links` - Favicon, icons
- `HydrateFallback` - Loading screen during initial load

---

### 5. Entry Point (`entry.client.jsx`)

This tiny file boots the entire app:

```javascript
import { HydratedRouter } from "react-router/dom"

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter />
  </StrictMode>,
)
```

**What `<HydratedRouter />` does:**

- Reads `routes.js` configuration
- Sets up routing system
- Renders `root.jsx` → first matching route

---

## The Building Blocks

### 1. **`react-router.config.js`** - Framework Configuration

```javascript
const config = {
  appDirectory: "src", // Where your code lives
  ssr: false, // Client-side only (no server rendering)
}
```

**What it controls:**

- Where to find source code
- Whether to enable SSR
- Build output settings

---

### 2. **`vite.config.js`** - Build Tool Configuration

```javascript
import { reactRouter } from "@react-router/dev/vite"

export default defineConfig({
  plugins: [
    reactRouter({
      routes: "./src/routes.js", // Points to route config
      // ... babel plugins for optimization
    }),
    // ... other plugins
  ],
})
```

**Key plugins:**

- `reactRouter` - Integrates React Router with Vite
- `eslintPlugin` - Code quality checks
- `webfontDownload` - Optimizes font loading

**Also defines:**

- Path aliases (`@/`, `@components`, etc.)
- Dev server proxy (forwards `/api` to Django backend)

---

### 3. **`src/routes.js`** - Route Definitions

```javascript
export default [
  route("/", "./routes/Root.jsx", [
    // Parent route
    index("./components/Welcome/Welcome.jsx"), // Default child (/)
    route("characters/:characterId", "./routes/CharacterLayout.jsx", [
      // Nested route
      index("./routes/CharacterIndex.jsx"), // Default child (/characters/0)
      route("introduction", "./components/Introduction/Introduction.jsx"), // /characters/0/introduction
    ]),
  ]),
]
```

**Route structure:**

- Tree structure (parent → children → grandchildren)
- Each route points to a component file
- Dynamic segments start with `:` (e.g., `:characterId`)

---

### 4. **`src/root.jsx`** - App Shell

**Exports 3 things:**

#### a. `Layout` Component

```javascript
export function Layout({ children }) {
  return (
    <html>
      <head>
        <Meta /> {/* Page metadata */}
        <Links /> {/* Favicon, icons */}
      </head>
      <body>
        {children} {/* Routes render here */}
        <ScrollRestoration /> {/* Remembers scroll position */}
        <Scripts /> {/* Loads JavaScript */}
      </body>
    </html>
  )
}
```

#### b. `Root` Component (Default Export)

```javascript
export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <StateProvider>
          <AppThemeProvider>
            <Outlet /> {/* Current route renders here */}
          </AppThemeProvider>
        </StateProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
```

**Providers wrap entire app:**

- `QueryClientProvider` - TanStack Query cache
- `LanguageProvider` - i18n translations
- `StateProvider` - Global React context
- `AppThemeProvider` - styled-components theme

#### c. `HydrateFallback` Component

```javascript
export function HydrateFallback() {
  return <div>Loading...</div> // Shows while app boots
}
```

---

### 5. **`src/routes/Root.jsx`** - First Route After App Shell

```javascript
export const id = "root" // Unique ID for this route

export async function clientLoader() {
  // Fetch CMS content tree (all screens need it)
  const locale = getCurrentLocale()
  const data = await queryClient.ensureQueryData(allContentQuery(locale))
  return { locale, hasContent: data.length > 0 }
}

export function ErrorBoundary() {
  // Catches errors from any child route
  return <ErrorPage />
}

export default function Root() {
  const { showModal } = useGlobalState()

  // Handle modals
  if (showModal === "privacy") return <Privacy />
  if (showModal === "imprint") return <Imprint />

  // Normal flow
  return (
    <MobileOnlyGuard>
      <Outlet /> {/* Child routes (Welcome, Characters, etc.) */}
    </MobileOnlyGuard>
  )
}
```

**Responsibilities:**

- Preload CMS content (so all screens have data)
- Handle privacy/imprint modals
- Enforce mobile-only access
- Catch errors from child routes

---

### 6. **`src/routes/CharacterLayout.jsx`** - Character Route Wrapper

```javascript
export const id = "character"

export async function clientLoader({ params }) {
  // Validate character ID from URL
  const characterId = params.characterId
  const characterIndex = Number.parseInt(characterId, 10)

  if (Number.isNaN(characterIndex) || characterIndex < 0) {
    throw new Response("Character not found", { status: 404 })
  }

  // Ensure character exists in CMS data
  const content = await queryClient.ensureQueryData(allContentQuery(locale))
  const characters = extractFromContentTree.getCharacters(content)

  if (!characters[characterIndex]) {
    throw new Response("Character not found", { status: 404 })
  }

  return { characterIndex }
}

export default function CharacterLayout() {
  return <Outlet /> // Renders Introduction, PhotoCapture, etc.
}
```

**Why this exists:**

- Validates character ID once (all child routes trust it)
- Catches 404 errors for invalid characters
- Provides a layout wrapper for all character-specific screens

````

**Why this exists:**

- Validates character ID once (all child routes trust it)
- Syncs URL to global state
- Catches 404 errors for invalid characters

---

### 7. **`src/routes/CharacterIndex.jsx`** - Auto-Redirect

```javascript
export async function clientLoader() {
  throw redirect("introduction") // Go to first screen
}

export default function CharacterIndex() {
  return null // Never renders
}
````

**Purpose:**

- When user visits `/characters/0`, automatically redirect to `/characters/0/introduction`
- Using `throw redirect()` is the React Router way to navigate in loaders

---

### 8. **Route Components** (e.g., `Welcome.jsx`, `Introduction.jsx`)

Every screen component follows this pattern:

```javascript
// 1. Imports
import { useLoaderData, useNavigate } from "react-router-dom"

// 2. Component
export default function Introduction() {
  const { character, introduction } = useLoaderData() // Get loader data
  const navigate = useNavigate() // Navigation function

  return (
    <div>
      <h1>{introduction.heading}</h1>
      <button onClick={() => navigate(`/characters/0/photo-capture`)}>
        Next
      </button>
    </div>
  )
}

// 3. Loader
export async function clientLoader({ params }) {
  const characterIndex = Number.parseInt(params.characterId, 10)
  const content = await queryClient.ensureQueryData(allContentQuery(locale))
  const character = extractFromContentTree.getCharacter(content, characterIndex)
  const introduction = extractFromContentTree.getIntroduction(
    content,
    characterIndex,
  )

  return { characterIndex, character, introduction }
}
```

**Pattern breakdown:**

1. Export default component (the UI)
2. Export `clientLoader` (fetches data)
3. Use `useLoaderData()` to access loader data
4. Use `useNavigate()` to move between screens

---

### 9. **`src/queryClient.js`** - Shared Cache

```javascript
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient()
```

**Why a singleton?**

- Loaders and components share the same cache
- Prevents duplicate API calls
- First loader fetches data, later ones get cached result

---

### 10. **`src/api/queries.js`** - Query Definitions

```javascript
export const allContentQuery = (locale) => ({
  queryKey: ["all", "locale", locale], // Unique cache key
  queryFn: async () => {
    const data = await fetchAllLocalesContent()
    return getContentForLocale(data, locale)
  },
})
```

**TanStack Query pattern:**

- `queryKey` - Unique identifier (caches by this)
- `queryFn` - Function that fetches data

**Used in loaders like this:**

```javascript
const content = await queryClient.ensureQueryData(allContentQuery(locale))
```

---

## How Data Flows

### The Complete Lifecycle

```
1. User clicks "Next" button
         ↓
2. navigate("/characters/0/introduction")
         ↓
3. React Router matches route in routes.js
         ↓
4. Calls Introduction's clientLoader({ params: { characterId: "0" } })
         ↓
5. Loader calls: queryClient.ensureQueryData(allContentQuery("en"))
         ↓
6. TanStack Query checks cache
         ├─ If cached: Return immediately
         └─ If not cached: Fetch from API, cache, return
         ↓
7. Loader extracts Introduction content from CMS tree
         ↓
8. Loader returns { characterIndex, character, introduction }
         ↓
9. React Router renders Introduction component
         ↓
10. Component calls useLoaderData() → gets loader return value
         ↓
11. Component renders with data
```

---

### Example: Navigating from Welcome to Introduction

**Step 1: User selects character and clicks "Start"**

```javascript
// Welcome.jsx (uses local state)
const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
const navigate = useNavigate()

const handleStart = () => {
  navigate(`/characters/${currentCharacterIndex}/introduction`)
}
```

**Step 2: React Router calls Introduction's loader**

```javascript
// Introduction.jsx
export async function clientLoader({ params }) {
  const characterId = params.characterId // "0" from URL
  const characterIndex = Number.parseInt(characterId, 10) // Convert to 0

  // Get CMS content (cached from Root loader)
  const content = await queryClient.ensureQueryData(allContentQuery(locale))

  // Extract character-specific content
  const character = extractFromContentTree.getCharacter(content, characterIndex)
  const introduction = extractFromContentTree.getIntroduction(
    content,
    characterIndex,
  )

  return { characterIndex, character, introduction }
}
```

**Step 3: Component renders with data**

```javascript
export default function Introduction() {
  const { character, introduction } = useLoaderData()

  return (
    <div>
      <h1>{introduction.heading}</h1>
      <p>{introduction.description}</p>
      <img src={character.characterImage.file} />
    </div>
  )
}
```

---

## File-by-File Breakdown

### Configuration Files (Root Level)

| File                     | Purpose                         | Key Contents                                 |
| ------------------------ | ------------------------------- | -------------------------------------------- |
| `react-router.config.js` | React Router framework settings | `appDirectory: "src"`, `ssr: false`          |
| `vite.config.js`         | Vite build tool configuration   | React Router plugin, path aliases, dev proxy |
| `package.json`           | Dependencies and scripts        | `react-router dev`, `react-router build`     |

### Entry Points (src/)

| File               | Purpose                      | Key Exports                         |
| ------------------ | ---------------------------- | ----------------------------------- |
| `entry.client.jsx` | Boots the app                | `hydrateRoot(<HydratedRouter />)`   |
| `root.jsx`         | App shell (HTML + providers) | `Layout`, `Root`, `HydrateFallback` |
| `routes.js`        | Route configuration          | Array of route definitions          |

### Route Files (src/routes/)

| File                  | Purpose                         | Key Exports                                        |
| --------------------- | ------------------------------- | -------------------------------------------------- |
| `Root.jsx`            | First route, handles modals     | `clientLoader`, `ErrorBoundary`, default component |
| `CharacterLayout.jsx` | Validates character, sets state | `clientLoader`, `id`, default component            |
| `CharacterIndex.jsx`  | Redirects to introduction       | `clientLoader` (throws redirect)                   |
| `ErrorPage.jsx`       | Error display                   | Default component                                  |

### Screen Components (src/components/)

| File                            | Route                           | Exports                                 |
| ------------------------------- | ------------------------------- | --------------------------------------- |
| `Welcome/Welcome.jsx`           | `/`                             | `clientLoader`, default component, `id` |
| `Introduction/Introduction.jsx` | `/characters/:id/introduction`  | `clientLoader`, default component       |
| `PhotoCapture/PhotoCapture.jsx` | `/characters/:id/photo-capture` | `clientLoader`, default component       |
| `Exploration/Exploration.jsx`   | `/characters/:id/exploration`   | `clientLoader`, default component       |
| `Perspective/Perspective.jsx`   | `/characters/:id/perspective`   | `clientLoader`, default component       |
| `Upload/Upload.jsx`             | `/characters/:id/upload`        | `clientLoader`, default component       |
| `Gallery/Gallery.jsx`           | `/characters/:id/gallery`       | `clientLoader`, default component       |
| `Ending/Ending.jsx`             | `/characters/:id/ending`        | `clientLoader`, default component       |

### Data Layer (src/api/)

| File           | Purpose                    | Key Exports                                         |
| -------------- | -------------------------- | --------------------------------------------------- |
| `queries.js`   | TanStack Query definitions | `allContentQuery(locale)`                           |
| `djangoApi.js` | API fetching functions     | `fetchAllLocalesContent()`, `getContentForLocale()` |
| `hooks.js`     | Content extractors         | `extractFromContentTree.*` functions                |

### State Management (src/)

| File              | Purpose                     | Key Exports                         |
| ----------------- | --------------------------- | ----------------------------------- |
| `queryClient.js`  | Shared TanStack Query cache | `queryClient` singleton             |
| `GlobalState.jsx` | React Context for app state | `StateProvider`, `useGlobalState()` |

---

## Complete Flow Example

### Scenario: User Selects Character 2 and Navigates to Introduction

**1. Initial Page Load**

```
Browser loads index.html
     ↓
entry.client.jsx: hydrateRoot(<HydratedRouter />)
     ↓
React Router reads routes.js
     ↓
Matches route: "/"
     ↓
Calls Root.jsx clientLoader (fetches all CMS content)
     ↓
Calls Welcome.jsx clientLoader (preloads images)
     ↓
Renders: root.jsx Layout → root.jsx Root → routes/Root.jsx → Welcome.jsx
```

**2. User Clicks Character 2**

```
Welcome.jsx: setCurrentCharacterIndex(2) // Local state
Welcome.jsx: navigate("/characters/2/introduction")
     ↓
React Router matches: "/characters/:characterId" + "introduction"
     ↓
Calls CharacterLayout.jsx clientLoader({ params: { characterId: "2" } })
  - Validates characterIndex = 2
  - Returns { characterIndex: 2 }
     ↓
Calls Introduction.jsx clientLoader({ params: { characterId: "2" } })
  - Gets content from cache (already loaded by Root)
  - Extracts character 2 data
  - Extracts introduction 2 data
  - Returns { characterIndex: 2, character, introduction }
     ↓
Renders: CharacterLayout → Introduction
     ↓
Introduction: useLoaderData() → { characterIndex: 2, character, introduction }
     ↓
Introduction renders with character 2's content
```

**3. User Clicks "Take Photo" Button**

```
Introduction.jsx: navigate(`/characters/${characterIndex}/photo-capture`)
                  → navigate("/characters/2/photo-capture")
     ↓
React Router matches: "/characters/:characterId" + "photo-capture"
     ↓
Calls PhotoCapture.jsx clientLoader({ params: { characterId: "2" } })
  - Gets content from cache
  - Extracts photography 2 data
  - Returns { characterIndex: 2, photography }
     ↓
Renders: CharacterLayout → PhotoCapture
     ↓
PhotoCapture: useLoaderData() → { characterIndex: 2, photography }
     ↓
PhotoCapture renders camera interface
```

---

## Key Patterns to Remember

### 1. Route Definition Pattern

```javascript
// src/routes.js
route("path", "./path/to/Component.jsx", [
  // Optional: nested child routes
  index("./path/to/IndexComponent.jsx"),
  route("child", "./path/to/ChildComponent.jsx"),
])
```

---

### 2. Loader Pattern

```javascript
// Any route component
export async function clientLoader({ params, request }) {
  // 1. Extract params
  const id = params.characterId

  // 2. Fetch/validate data
  const data = await queryClient.ensureQueryData(query)

  // 3. Return data for component
  return { id, data }
}
```

---

### 3. Component Pattern

```javascript
export default function MyScreen() {
  const data = useLoaderData() // Get loader data
  const navigate = useNavigate() // Navigation function

  return (
    <div>
      <h1>{data.title}</h1>
      <button onClick={() => navigate("/next-screen")}>Next</button>
    </div>
  )
}
```

---

### 4. Error Handling Pattern

```javascript
// Throw from loader to trigger error boundary
export async function clientLoader({ params }) {
  const item = await fetchItem(params.id)

  if (!item) {
    throw new Response("Not found", { status: 404 })
  }

  return { item }
}

// Catch errors in route
export function ErrorBoundary() {
  return <ErrorPage />
}
```

---

### 5. Redirect Pattern

```javascript
// Redirect in loader
export async function clientLoader() {
  const user = await getUser()

  if (!user) {
    throw redirect("/login")
  }

  return { user }
}
```

---

### 6. Layout Pattern

```javascript
export default function Layout() {
  const data = useLoaderData() // Can access own loader data

  return (
    <div>
      <Header />
      <Outlet /> {/* Child routes render here */}
      <Footer />
    </div>
  )
}
```

---

### 7. TanStack Query + Loader Pattern

```javascript
// Define query (reusable)
export const myQuery = (id) => ({
  queryKey: ["items", id],
  queryFn: () => fetchItem(id),
})

// Use in loader
export async function clientLoader({ params }) {
  const item = await queryClient.ensureQueryData(myQuery(params.id))
  return { item }
}

// Use in component (gets cached data)
export default function MyScreen() {
  const { item } = useLoaderData()
  // ...
}
```

---

### 8. Navigation Pattern

```javascript
// Declarative (in JSX)
// Imperative (in functions)
import { Link, useNavigate } from "react-router-dom"

;<Link to="/characters/0/introduction">Start</Link>

const navigate = useNavigate()
navigate("/characters/0/introduction")

// With state
navigate("/next", { state: { from: "welcome" } })

// Replace (don't add to history)
navigate("/next", { replace: true })
```

---

## Summary

### What Each Piece Does

| Piece                        | Purpose             | Why We Need It                                       |
| ---------------------------- | ------------------- | ---------------------------------------------------- |
| `react-router.config.js`     | Framework settings  | Tells React Router where code lives and how to build |
| `vite.config.js`             | Build configuration | Integrates React Router plugin with Vite             |
| `routes.js`                  | Route map           | Single source of truth for all URLs                  |
| `entry.client.jsx`           | App bootstrap       | Starts the entire application                        |
| `root.jsx`                   | HTML shell          | Provides `<html>`, `<head>`, `<body>`, and providers |
| `routes/Root.jsx`            | First route         | Preloads CMS content, handles modals, error boundary |
| `routes/CharacterLayout.jsx` | Character validator | Validates character ID, syncs to global state        |
| Screen components            | UI + data           | Export component + loader, render screen             |
| `queryClient.js`             | Cache               | Shares API data between loaders and components       |
| `queries.js`                 | Query definitions   | Defines how to fetch and cache data                  |

### The Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│  Framework Layer                        │
│  (React Router + Vite Plugin)           │
│  - Routes configuration                 │
│  - Loaders (data fetching)              │
│  - Code splitting                       │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  Data Layer                             │
│  (TanStack Query + Django API)          │
│  - Caching                              │
│  - API calls                            │
│  - Content extraction                   │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  UI Layer                               │
│  (React Components + Styled Components) │
│  - Screen components                    │
│  - User interactions                    │
│  - Visual rendering                     │
└─────────────────────────────────────────┘
```

### Key Takeaways

1. **URL is the source of truth** - Navigation state lives in the URL
2. **Loaders fetch before render** - Components receive data, never fetch
3. **TanStack Query caches everything** - No duplicate API calls
4. **Routes are nested** - Parent layouts wrap child screens
5. **Providers wrap the app** - Theme, state, translations, queries
6. **Framework handles complexity** - Code splitting, SSR, hydration

---

## Further Reading

- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Vite Documentation](https://vite.dev)
- Project-specific: `react-router.md` (migration guide)
- Project-specific: `.github/copilot-instructions.md` (detailed architecture)

---

**Questions?** Check the existing route components for patterns, or explore the [React Router examples](https://reactrouter.com/start/framework/routing).
