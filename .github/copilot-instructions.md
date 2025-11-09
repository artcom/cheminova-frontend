# Copilot Coding Agent Onboarding Guide

## 1. Repository Summary

- **Purpose**: Interactive photo gallery web app for cultural heritage site (La Nau). Users take photos, select guide characters, explore content through linear screen flow ending with 3D gallery.
- **Stack**: React 19, Vite 7, styled-components, motion (Framer Motion), React Three Fiber (R3F), TanStack Query, i18next
- **Size**: ~50 components, multi-screen flow (Welcome → PhotoCapture → Exploration → Gallery), CMS-driven content
- **Runtime**: Browser (ESM). Development uses Django CMS backend API at `localhost:8080`, production at `/cms/api`
- **Entry Points**: `index.html` → `src/main.jsx` → `src/components/App/App.jsx` (state-based screen router)

## 2. Core Domains & Architecture

| Domain                      | Location                                                             | Notes                                                                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screen Flow Router**      | `src/components/App/App.jsx`                                         | State-based routing: `welcome` → `introduction` → `photoCapture` → `exploration` → `perspective` → `upload` → `gallery` → `ending`. No React Router.                   |
| **CMS Data Layer**          | `src/api/djangoApi.js`, `src/api/hooks.js`                           | Fetches tree structure from `/cms/api/all/` endpoint. Uses TanStack Query + custom `useLocalizedQuery` hook.                                                           |
| **Content Tree Navigation** | `src/api/hooks.js` (`extractFromContentTree`)                        | Functions traverse hierarchical CMS data: `getWelcome()` → `getCharacterOverview()` → `getCharacter(index)` → `getIntroduction(index)` → `getPhotography(index)`, etc. |
| **Localization**            | `src/i18n/`, `src/providers/LanguageProvider.jsx`, `public/locales/` | i18next with browser detection + localStorage. Supports EN, DE, ES, FR. CMS content is locale-specific; UI labels use translation files.                               |
| **Global State**            | `src/GlobalState.jsx` (Context API)                                  | Manages character selection, screen navigation history, modal state (privacy/imprint). Use `useGlobalState()` hook.                                                    |
| **3D Gallery**              | `src/components/Gallery/`                                            | React Three Fiber canvas with custom image grid, camera controller, stack bump animation. Uses `@react-three/fiber` + `@react-three/drei`.                             |
| **Styled Components**       | `src/theme/`, inline styled components                               | Theme provider with centralized colors, spacing. Components define styled elements inline (e.g., `styled.div`).                                                        |

**Key Architectural Pattern**: CMS returns nested JSON tree; extractors in `src/api/hooks.js` navigate by character index + screen depth. Example: `useExplorationFromAll(characterIndex)` traverses: Welcome → CharacterOverview → Character[index] → Introduction → Photography → **Exploration**.

## 3. Build & Run Instructions

**Always perform these in order after cloning or pulling changes:**

1. **Install dependencies** (mandatory before anything else):

```bash
npm install
```

2. **Development server** (hot reload):

```bash
npm run dev          # Opens localhost:5173
npm run dev:host     # Exposes to network
```

3. **Type check + build production bundle**:

```bash
npm run build        # Outputs to dist/
```

4. **Preview production build locally**:

```bash
npm run preview
```

5. **Lint** (do this before committing):

```bash
npm run lint
npm run format       # Check formatting
npm run format:write # Fix formatting
```

**Tool Versions**: Node >=18 LTS, React 19, Vite 7. No custom global CLIs required.

## 4. Testing Status

- Currently **no formal test suite** configured (no Jest/Vitest).
- Validation gates: `npm run lint` + `npm run build` + manual testing.
- If adding tests, prefer Vitest (integrates with Vite) and place under `src/__tests__`.

## 5. Validation Checklist Before Submitting Changes

Always ensure:

1. ✅ `npm run lint` passes with no errors
2. ✅ `npm run build` completes without errors
3. ✅ App loads and flows through all screens without console errors
4. ✅ Language switching works (EN/DE/ES/FR) and persists in localStorage
5. ✅ No stray debug `console.log` left (except intentional logs)

## 6. Environment & Configuration

**API Configuration** (`src/config/api.js`):

- Development: `http://localhost:8080` (Django CMS backend)
- Production: `/cms/api` (absolute path works from any subdirectory)
- Override with `.env.local`: `VITE_API_BASE_URL=http://localhost:8000`

**Language Configuration** (`src/config/language.js`):

- Centralized constants: cache times, retry attempts, storage keys
- Languages stored in localStorage key: `chemisee-language`
- Supported: EN (default), DE, ES, FR

**i18next Setup** (`src/i18n/index.js`):

- Auto-detects from: localStorage → navigator → htmlTag
- UI translations: `public/locales/{lng}/translation.json`
- CMS content: locale-specific from Django API

## 7. Critical Development Patterns

### CMS Content Access Pattern

Always use `useLocalizedQuery` for CMS data (not raw `useQuery`). Example:

```javascript
const { data: explorationData } = useExplorationFromAll(characterIndex)
```

### Screen State Navigation

Do NOT add React Router. Use state machine in `App.jsx`:

```javascript
setState("exploration") // Valid states: see App.jsx
```

### Language Detection Flow

1. `LanguageProvider` fetches all locales from `/cms/api/all/`
2. `i18next` detects user language (localStorage → browser → fallback)
3. `useLocalizedQuery` automatically filters CMS tree by current locale
4. Components never call `getContentForLocale` directly

### Styled Components Pattern

Use inline styled definitions with theme access:

```javascript
const Button = styled.button`
  background: ${theme.colors.primary.main};
`
```

### 3D Gallery Architecture

- Canvas setup: `src/components/Gallery/Gallery.jsx`
- Camera control: `CameraController.jsx` (drag-based navigation)
- Image tiles: `AnimatingTile.jsx` (custom bump animation)
- Stack effect: `StackBump.jsx` (entry animation)

## 8. Common Pitfalls & Solutions

| Pitfall                     | Solution                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| Accessing CMS data directly | Always use `extractFromContentTree` functions or provided hooks                                     |
| Hardcoded UI text           | Check `public/locales/{lng}/translation.json` first; use `useTranslation()`                         |
| Missing character context   | Components like Exploration/Introduction need `characterIndex` from global state                    |
| CMS tree traversal errors   | Structure: Welcome → CharacterOverview → Character → Introduction → Photography → Exploration → ... |
| Language not switching      | Verify localStorage key is `chemisee-language`, not a generic one                                   |
| New screen in flow          | Add to `App.jsx` state machine AND update navigation handlers                                       |
| R3F performance issues      | Avoid state updates in `useFrame`; use refs or imperative Three.js calls                            |

## 9. Directory Layout (Key Files)

Root important files:

```
package.json            # scripts & deps
vite.config.js          # Vite + React plugins, path aliases
eslint.config.js        # ESLint flat config (React 19 + Prettier)
jsconfig.json           # path alias resolution for IDE
API_CONFIGURATION.md    # CMS endpoint setup (dev vs prod)
CMS_IMPLEMENTATION_SUMMARY.md  # Complete CMS field mapping
LANGUAGE_SYSTEM_FLOW.md        # Deep dive into i18n architecture
index.html              # entry point
src/                    # application source
public/locales/         # i18n translation files (en, de, es, fr)
```

`src/` notable structure:

```
main.jsx                # React root with providers (QueryClient, Language, Theme, GlobalState)
GlobalState.jsx         # Context API for character selection & navigation
i18n/index.js           # i18next initialization
api/
  djangoApi.js          # API request wrapper + locale filtering
  hooks.js              # extractFromContentTree + all content hooks
config/
  api.js                # API_BASE_URL resolution (dev/prod)
  language.js           # centralized i18n constants
providers/
  LanguageProvider.jsx  # fetches all locales, provides supported languages
components/
  App/App.jsx           # state-based screen router
  Welcome/              # character selection carousel
  Introduction/         # character intro screen
  PhotoCapture/         # camera interface for user photos
  Exploration/          # CMS-driven content exploration
  Perspective/          # conclusion/transition screen
  Upload/               # user photo upload to CMS
  Gallery/              # React Three Fiber 3D gallery
    components/         # AnimatingTile, CameraController, StackBump, etc.
  UI/                   # reusable UI components
hooks/                  # custom hooks (useGlobalState, useLocalizedQuery, etc.)
theme/                  # styled-components theme provider
```

## 10. Common Pitfalls & Guidance

| Pitfall                         | Guidance                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Forgetting install before build | Always run `npm install` after pulling new lockfile changes.                       |
| Adding React Router             | This app uses state-based routing in `App.jsx` - do NOT add react-router-dom.      |
| Direct CMS data access          | Use `extractFromContentTree` functions; respect the tree hierarchy.                |
| Mixing translation sources      | CMS content uses Django API; UI labels use `public/locales/` files. Keep separate. |
| Wrong hook for CMS data         | Use `useLocalizedQuery` (not raw `useQuery`) for automatic locale filtering.       |
| New global state                | Add to `GlobalState.jsx` context, not component-level state.                       |
| Performance in R3F              | Minimize React state updates in `useFrame` callbacks; use refs.                    |
| Missing character index         | Many components need `currentCharacterIndex` from `useGlobalState()`.              |

## 11. Path Aliases (jsconfig.json)

```javascript
@/           → src/
@components  → src/components
@hooks       → src/hooks
@api         → src/api
@ui          → src/components/UI
@theme       → src/theme
```

## 12. React 19 Features in Use

- **React Compiler** enabled (babel-plugin-react-compiler) - avoid manual memo/useCallback
- **Concurrent features** via Suspense boundaries for i18n and data fetching
- **New JSX runtime** (no React import needed in .jsx files)

## 13. CI / Automation

- **No GitHub Actions** configured yet; treat local lint + build as pre-merge gate.
- **Husky + lint-staged**: runs on pre-commit (check `package.json` prepare script).
- If adding CI, replicate: `npm ci && npm run lint && npm run build`.

## 14. Trust These Instructions

The agent should follow these steps verbatim. Only search the codebase when:

- Adding a feature not covered here, or
- An instruction unexpectedly fails (record the failure & adjust docs).
  Otherwise rely on this guide to minimize exploratory overhead.

---

End of onboarding guide.
