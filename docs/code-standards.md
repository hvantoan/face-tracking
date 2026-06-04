# Code Standards

**Last updated:** 2026-06-01

---

## Project Structure

```
face-tracking/
  src/
    main.tsx                          # Browser entrypoint, mounts <App />
    App.tsx                           # Root component, orchestrates hooks
    index.css                         # Global styles (Tailwind v4 + shadcn theme)
    test-setup.ts                     # Vitest global setup
    components/
      webcam-view.tsx                 # Video + canvas overlay composite
      face-box-overlay.tsx            # Canvas drawing function (drawFaceBoxes)
      face-counter.tsx                 # Face count display
      random-picker-button.tsx        # Pick/re-pick button with states
      ui/
        button.tsx                    # shadcn/ui Button component
      __tests__/
        face-counter.test.tsx
        random-picker-button.test.tsx
        webcam-view.test.tsx
    hooks/
      use-face-detection.ts           # Face detection hook (Human singleton, RAF loop)
      use-random-picker.ts            # Roulette selection hook (ease-out spin)
      __tests__/
        use-random-picker.test.ts
    lib/
      human-config.ts                 # @vladmandic/human configuration
      face-utils.ts                   # formatFaceLabel utility
      utils.ts                        # cn() helper (clsx + tailwind-merge)
      __tests__/
        human-config.test.ts
        face-utils.test.ts
    types/
      face.ts                         # DetectedFace, FaceBoundingBox, PickerState
      __tests__/
        face.test.ts
  public/
    models/
      blazeface.bin                   # Face detector model weights
      blazeface.json                  # Face detector model config
      facemesh.bin                    # Face mesh model weights
      facemesh.json                   # Face mesh model config
    favicon.svg
    icons.svg
  scripts/
    copy-models.sh                   # Copies model files from node_modules to public/models/
```

## File Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| React components | kebab-case.tsx | `webcam-view.tsx`, `face-counter.tsx` |
| React hooks | kebab-case.ts | `use-face-detection.ts`, `use-random-picker.ts` |
| Utility modules | kebab-case.ts | `face-utils.ts`, `human-config.ts` |
| Type definitions | kebab-case.ts | `face.ts` |
| Test files | kebab-case.test.tsx | `face-counter.test.tsx` |
| Shell scripts | kebab-case.sh | `copy-models.sh` |
| Config files | kebab-case (project root) | `vite.config.ts`, `vitest.config.ts` |

## Component Standards

### Component Structure

Each component file exports a single named component. No default exports except `App`:

```tsx
// Good: named export
export function FaceCounter({ count }: FaceCounterProps) { ... }

// Bad: default export (except App.tsx)
export default function FaceCounter() { ... }
```

### Props Interface

Define props interface directly above the component, named `{ComponentName}Props`:

```tsx
interface WebcamViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  faces: DetectedFace[]
  highlightedIndex: number | null
  selectedIndex: number | null
}
```

### Component Size Limit

Keep components under **50 lines** of JSX. Extract complex rendering into separate modules (like `drawFaceBoxes` extracted to `face-box-overlay.tsx`).

## Hook Standards

### Hook File Pattern

```ts
// 1. Imports
// 2. Type exports (interface for return type)
// 3. Constants
// 4. Module-level singletons (if any)
// 5. Hook implementation
// 6. Cleanup on unmount via useEffect return
```

### Rules

- **Module-level singletons** for expensive resources (ML models). Never store in `useRef` or `useState` for things that must survive StrictMode remounts.
- **AbortController** for async init that may be cancelled on unmount/remount.
- **requestAnimationFrame** for detection loops, not `setInterval`.
- **Cleanup functions** on every `useEffect` that starts resources (RAF, webcam, timers).

Example pattern from `use-face-detection.ts`:

```ts
// Module-level singleton (StrictMode-safe)
let humanInstance: Human | null = null
function getHuman(): Human {
  if (!humanInstance) humanInstance = new Human(humanConfig)
  return humanInstance
}

// Inside hook:
const initAbortRef = useRef<AbortController | null>(null)

const startDetection = useCallback(async () => {
  initAbortRef.current?.abort()
  const abortController = new AbortController()
  initAbortRef.current = abortController

  // ... async init ...
  if (abortController.signal.aborted) return
  // ... start loop ...
}, [])
```

## TypeScript Standards

### Config Highlights (`tsconfig.app.json`)

- `target: es2023` -- modern browser target
- `jsx: react-jsx` -- automatic JSX transform
- `moduleResolution: bundler` -- Vite-compatible
- `allowImportingTsExtensions: true` -- can import `.tsx` files
- `noUnusedLocals: true` -- strict unused variable checking
- `noUnusedParameters: true` -- strict unused param checking
- `noFallthroughCasesInSwitch: true` -- no implicit fallthrough
- `verbatimModuleSyntax: true` -- explicit type imports
- `paths: { "@/*": ["./src/*"] }` -- path alias for clean imports

### Import Conventions

```ts
// Path alias for src imports
import { DetectedFace } from '@/types/face'
import { useFaceDetection } from '@/hooks/use-face-detection'

// Type-only imports use `import type`
import type { Config } from '@vladmandic/human'
```

### Type Definitions

- Define domain types in `src/types/`. Do not scatter type definitions across component files.
- Use `as const` objects + derived union types for enums (like `PickerStateEnum`).
- Use `interface` for object shapes, `type` for unions/intersections.

```ts
export const PickerStateEnum = {
  IDLE: 'idle',
  SPINNING: 'spinning',
  SELECTED: 'selected',
} as const

export type PickerState = (typeof PickerStateEnum)[keyof typeof PickerStateEnum]
```

## Styling Standards

### Tailwind v4 + shadcn/ui

- Global styles in `src/index.css` using Tailwind v4 `@import` syntax
- Theme uses CSS custom properties (oklch color space) defined in `:root` and `.dark`
- Use shadcn/ui theme variables (`--primary`, `--destructive`, etc.) for consistency
- Component-specific styles use Tailwind utility classes inline
- Use `cn()` utility from `src/lib/utils.ts` for conditional class merging

### Layout Pattern

```tsx
// Mobile-first responsive layout
<div className="min-h-svh flex flex-col items-center bg-background text-foreground">
  <main className="w-full max-w-2xl flex flex-col gap-4 p-4">
    {/* content */}
  </main>
</div>
```

### Canvas Drawing

Canvas drawing uses CSS custom property references via `hsl(var(--primary))` pattern to match shadcn theme. Canvas resolution is set explicitly to `video.videoWidth` x `video.videoHeight`.

## Testing Standards

### Framework

- **Vitest** as test runner with `jsdom` environment
- **@testing-library/react** for component tests
- **@testing-library/jest-dom** for DOM assertions (`toBeInTheDocument`, etc.)
- Config in `vitest.config.ts` with `@` path alias

### Test File Location

Co-located in `__tests__/` directories next to the source file:

```
hooks/
  use-random-picker.ts
  __tests__/
    use-random-picker.test.ts
```

### Test Naming

- `describe('{ComponentName}', ...)` or `describe('{hookName}', ...)`
- `it('does X when Y', ...)`

### Timer Testing

For hooks with timers (like `useRandomPicker`), use `vi.useFakeTimers()` in `beforeEach` and `vi.useRealTimers()` in `afterEach`. Advance time with `vi.advanceTimersByTime()`.

### Coverage Expectations

- 29 tests currently passing
- All pure logic hooks tested with fake timers
- All presentational components tested for render behavior
- Config objects tested for correct values
- Type contracts validated

## Error Handling

### User-Facing Errors

All user-facing error messages are in Vietnamese:

| Error Key | Vietnamese | English |
|-----------|-----------|---------|
| Camera denied | Quyen truy cap camera bi tu choi | Camera access permission denied |
| Camera not found | Khong tim thay thiet bi camera | Camera device not found |
| Camera generic | Khong the khoi dong camera | Cannot start camera |

### Code-Level Error Handling

- Detection frame errors: silently caught in RAF loop, loop continues
- `faceCount = 0` on `triggerPick`: returns `idle` state, no crash
- Component unmount: abort async init, cancel RAF, stop webcam

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint check |
| `npm run test` | Run Vitest tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run preview` | Preview production build locally |
| `bash scripts/copy-models.sh` | Copy ML model files to public/models/ |

## Key Constraints

1. **Max file size: 200 lines** -- split larger files into focused modules
2. **No cloud APIs** -- everything runs client-side
3. **Vietnamese UI** -- all user-facing text in Vietnamese
4. **Offline-first** -- model files in `public/models/`, no CDN fallback
5. **Module-level singletons** for ML models -- never recreate on React remount
6. **AbortController** for any async init that spans across mount/unmount cycles