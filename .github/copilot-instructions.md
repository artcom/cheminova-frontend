# Copilot Coding Agent Onboarding Guide

(Keep this concise: ~2 pages max. Trust these instructions; search only if something here proves incomplete.)

## 1. Repository Summary

- Purpose: Interactive color slider with advanced WebGL blur (Three.js) + animated trail + MQTT publishing of slider position.
- Stack: React 19, TypeScript 5, Vite 7, Framer Motion, Three.js, mqtt.js, GLSL shaders (via `vite-plugin-glsl`).
- Size: Small app (single page) but a few large source files (`SliderGesture.tsx`, `ShapeBlur.tsx`); ongoing refactor to split into smaller modules.
- Runtime: Browser (ESM) + optional local MQTT broker (HiveMQ CE) via Docker.
- Entry Points: `index.html` -> `src/main.tsx` -> `src/App.tsx` -> `src/SliderGesture.tsx`.

## 2. Core Domains

| Domain                                | Location                                                                  | Notes                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Slider interaction (drag, dots, tail) | `src/hooks/*` + `src/SliderGesture.tsx`                                   | Hooks encapsulate logic (drag, dots, tail follower, arrival, bump).       |
| State Machine                         | `src/state/sliderStateMachine.ts`                                         | Pure reducer + hook wrapper; events drive bump & phases.                  |
| WebGL blur & trail                    | `src/ShapeBlur.tsx`, `src/lib/gl/*`, `src/shaders/*`                      | Uses Three.js + custom shaders; MotionValues drive uniforms.              |
| MQTT integration                      | `src/config/mqtt.ts` + inline effect in `SliderGesture` (to be extracted) | Publishes scaled slider position to `mediaStation/norden/onSliderChange`. |
| Configuration/constants               | `src/config/slider.ts`, `src/config/mqtt.ts`                              | Central numerical + palette constants.                                    |
| Color utilities                       | `src/lib/color.ts`                                                        | Interpolation, saturation.                                                |
| Refactor plans/docs                   | `REFACTOR_PLAN.md`, `REFRACTORING.MD`, `README_STATE_MACHINE.md`          | Consult before structural changes.                                        |

## 3. Build & Run Instructions

Always perform these in order after cloning or pulling changes.

1. Install dependencies (mandatory before anything else):

```bash
npm install
```

2. Development server (hot reload):

```bash
npm run dev
```

- Opens (or logs) local Vite server (default: http://localhost:5173). No extra build step needed.

3. Type check + build production bundle:

```bash
npm run build
```

- Runs `tsc -b` then `vite build`; outputs to `dist/`.

4. Preview production build locally:

```bash
npm run preview
```

5. Lint (do this before committing):

```bash
npm run lint
```

6. Auto-fix lint + formatting (safe for staged or full tree):

```bash
npm run lint:fix
npm run format
```

7. MQTT broker (only if working with publish feature):

```bash
npm run mqtt:up     # start HiveMQ CE (detached)
npm run mqtt:logs   # view logs
npm run mqtt:down   # stop
```

8. One-off local broker rebuild (rarely needed):

```bash
npm run mqtt:rebuild
```

Tool Versions (declared in `package.json`): Node (use >=18 LTS), TypeScript ~5.8, Vite ^7. No custom global CLIs required.

## 4. Testing Status

- Currently no formal test suite configured (no Jest/Vitest). Treat build + lint + manual run as validation gates.
- If you add tests, prefer Vitest (integrates with Vite) and place under `src/__tests__`.

## 5. Validation Checklist Before Submitting Changes

Always ensure:

1. `npm run lint` passes with no errors (warnings acceptable unless introducing new ones—prefer fixing).
2. `npm run build` completes without TypeScript errors.
3. App loads and slider can be dragged end-to-end without console errors.
4. If modifying MQTT logic and broker is running: position messages publish to topic (observe via external subscriber if possible).
5. No stray debug `console.log` left (except intentional connection logs).

## 6. Environment & Configuration

- MQTT broker URL resolved from `import.meta.env.VITE_MQTT_BROKER_URL` or defaults to `ws://localhost:8000/mqtt` (see `src/config/mqtt.ts`).
- Provide `.env` (or `.env.local`) with `VITE_MQTT_BROKER_URL` only if deviating from default.
- Do not hardcode alternative endpoints; extend config module instead.

## 7. Architectural Pointers

- `SliderGesture.tsx` orchestrates: sets up motion values, hooks, MQTT publish loop, and renders shape blur + dots + debug panel.
- MotionValue dependencies: `headX`, `tailX` drive track width & WebGL uniforms; keep subscription logic centralized (avoid duplicate listeners).
- State machine dispatch events instead of adding new booleans; extend `SliderEvent` union for new interactions.
- WebGL `ShapeBlur` is performance sensitive: avoid triggering React re-renders for purely animated uniform changes; prefer MotionValues or refs.
- Throttled publishing: respect `PUBLISH_MAX_FPS` constant; if adjusting, update `src/config/slider.ts` only.

## 8. Adding/Modifying Features Safely

- Need new slider behavior? First extend state machine events rather than layering ad-hoc flags.
- New constants: add to appropriate config file and re-export; avoid scattering numeric literals.
- Extra animation: place in a dedicated hook (mirroring `useBumpAnimation`) with clearly documented inputs/outputs.
- For multi-slider potential, avoid singletons (no module-level mutable state outside React except pure constants).

## 9. Directory Layout (Key Files)

Root important files:

```
package.json            # scripts & deps
vite.config.ts          # Vite + GLSL plugin
eslint.config.js        # ESLint flat config
tsconfig.json           # root TS build config
tsconfig.app.json       # app tsconfig
Dockerfile.hivemq       # broker image build
docker-compose.mqtt.yml # compose for HiveMQ
README*.md              # various docs & plans
src/                    # application source
public/                 # static assets
hivemq/conf/config.xml  # broker websocket path (/mqtt)
```

`src/` notable:

```
App.tsx                 # root component wrapper
SliderGesture.tsx       # main slider orchestration component
ShapeBlur.tsx           # WebGL blur & trail rendering
config/slider.ts        # slider constants
config/mqtt.ts          # MQTT config + broker URL resolution
hooks/                  # interaction + animation logic
  useSliderDrag.ts
  useSliderDots.ts
  useTailFollower.ts
  useDotArrival.ts
  useBumpAnimation.ts
  useShapeBlurInit.ts
  useTailFollower.ts
lib/
  color.ts              # palette interpolation utilities
  gl/                   # GL helpers (createMaterial, trailManager)
state/sliderStateMachine.ts
shaders/shapeBlur.*.glsl
components/Slider/
  SliderDots.tsx
  SliderDebugPanel.tsx
```

## 10. Common Pitfalls & Guidance

| Pitfall                         | Guidance                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Forgetting install before build | Always run `npm install` after pulling new lockfile changes.                         |
| Duplicating animation loops     | Use existing hooks; do not add new `requestAnimationFrame` loops unless centralized. |
| Hardcoding MQTT URL             | Use `getMqttConfigSnapshot()` or exported constants.                                 |
| Adding magic numbers            | Put them into slider config.                                                         |
| Touching large files directly   | Prefer extracting logic to new small modules; update imports gradually.              |
| Unbounded arrays in GL trail    | Respect `TRAIL_MAX_SAMPLES_GPU`; adjust constants not ad-hoc values.                 |

## 11. Extending State Machine

- File: `src/state/sliderStateMachine.ts`
- To add event: extend `SliderEvent` union + reducer `switch`. Keep reducer pure (no side-effects).
- Use hook callbacks (`onCoreEnter`, `onCoreExit`, `onBumpStart`, `onBumpEnd`) for side-effects.

## 12. Performance Considerations

- Avoid forcing React state updates inside high-frequency drag loops; rely on MotionValues.
- Keep new subscriptions unsubscribed in cleanup; follow patterns in existing hooks.
- Publishing loop already throttled; if adding new network loops, ensure similar throttling.

## 13. CI / Automation

- No GitHub Actions workflows present yet; treat local lint + build as pre-merge gate.
- If adding CI, replicate: `npm ci && npm run lint && npm run build`.

## 14. Trust These Instructions

The agent should follow these steps verbatim. Only search the codebase when:

- Adding a feature not covered here, or
- An instruction unexpectedly fails (record the failure & adjust docs).
  Otherwise rely on this guide to minimize exploratory overhead.

---

End of onboarding guide.
