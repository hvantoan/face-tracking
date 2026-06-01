# System Architecture

**Last updated:** 2026-06-01

---

## High-Level Architecture

```
+---------------------------------------------------+
|                    Browser                          |
|                                                    |
|  +---------------+     +------------------------+  |
|  |   App.tsx     |---->|  useFaceDetection hook  |  |
|  |  (orchestrator)|    |  - Human singleton      |  |
|  |               |<----|  - RAF detection loop    |  |
|  |               |     |  - webcam start/stop     |  |
|  |               |     +------------------------+  |
|  |               |                                  |
|  |               |     +------------------------+  |
|  |               |---->|  useRandomPicker hook   |  |
|  |               |<----|  - roulette spin logic   |  |
|  |               |     |  - ease-out deceleration |  |
|  |               |                                  |
|  +-------+-------+                                  |
|          |                                          |
|    +-----+-----+                                    |
|    |           |                                    |
|  +-v---------+-v----------+                        |
|  | WebcamView |FaceCounter | RandomPickerButton    |
|  | (video +   | (count)    | (trigger/reset)        |
|  |  canvas)   |           |                        |
|  +-----+------+-----------+                        |
|        |                                             |
|  +-v---------+                                       |
|  |FaceBoxOverlay| (canvas drawing)                 |
|  +-------------+                                       |
|                                                        |
|  +-------------+   +-------------+                    |
|  | human-config |   | face-utils  |                    |
|  +-------------+   +-------------+                    |
|  +-------------+   +-------------+                    |
|  |  face.ts     |   |   utils.ts  |                    |
|  |  (types)     |   |  (cn helper) |                    |
|  +-------------+   +-------------+                    |
+---------------------------------------------------+
         |                              |
         v                              v
   +------------+                 +-----------+
   | /models/   |                 | @vladmandic |
   | blazeface  |                 |  /human     |
   | facemesh   |                 |  (TFJS)     |
   +------------+                 +-----------+
```

## Component Hierarchy

```
App
 +-- WebcamView
 |    +-- <video> (webcam feed via ref)
 |    +-- <canvas> (face box overlay via drawFaceBoxes)
 +-- FaceCounter
 +-- RandomPickerButton
      +-- Button (shadcn/ui)
```

## Data Flow

### Face Detection Pipeline

```
App mounts
  -> useEffect calls startDetection()
    -> getHuman() (module singleton, created once)
    -> human.load() + human.warmup()
    -> human.webcam.start({ element: videoRef })
    -> requestAnimationFrame loop starts

Each animation frame:
  human.detect(video) -> raw face results
    -> mapFaceResult() -> DetectedFace[]
      -> setFaces() -> triggers React re-render
        -> WebcamView re-renders
          -> drawFaceBoxes() paints on canvas
```

### Random Picker Flow

```
User clicks "CHON"
  -> triggerPick()
    -> pickerState = 'spinning'
    -> setTimeout tick loop:
      - highlightedIndex cycles through face indices
      - interval *= DECELERATION_FACTOR (1.15) each tick
      - elapsed time tracked
    -> when elapsed >= 2500ms:
      - selectedIndex = random target
      - pickerState = 'selected'

User clicks "CHON LAI" or face count changes:
  -> triggerPick() or reset()
    -> pickerState = 'idle' | 'spinning'
```

## Module Details

### `src/hooks/use-face-detection.ts`

The core face detection hook. Returns:

| Export | Type | Purpose |
|--------|------|---------|
| `useFaceDetection` | hook | Main hook returning faces, loading state, error, videoRef, start/stop |
| `UseFaceDetectionReturn` | interface | Return type definition |
| `mapFaceResult` | function (internal) | Maps raw Human face results to `DetectedFace[]` |
| `getHuman` | function (internal) | Module-level Human singleton factory |

Key behaviors:
- **Module-level singleton**: `humanInstance` lives at module scope, not inside React. This survives StrictMode double-mount without re-initializing the ML model.
- **AbortController**: `startDetection` creates an `AbortController` each invocation. On StrictMode remount or component unmount, the previous init is aborted cleanly.
- **RAF loop**: Detection runs in `requestAnimationFrame` cycle. The loop function is stored in a ref to avoid stale closures.

### `src/hooks/use-random-picker.ts`

Roulette-style random selection hook. Returns:

| Export | Type | Purpose |
|--------|------|---------|
| `useRandomPicker` | hook | Takes `faceCount`, returns picker state and controls |
| `UseRandomPickerReturn` | interface | Return type definition |

Spin algorithm constants:
- `SPIN_DURATION_MS = 2500` -- total spin time
- `INITIAL_INTERVAL_MS = 50` -- starting tick speed
- `DECELERATION_FACTOR = 1.15` -- each tick interval multiplied by this, creating ease-out

### `src/components/webcam-view.tsx`

Composite component rendering `<video>` + `<canvas>` overlay. The canvas is sized to match `video.videoWidth` x `video.videoHeight` and absolutely positioned over the video.

### `src/components/face-box-overlay.tsx`

Pure canvas drawing function `drawFaceBoxes()`. Renders bounding boxes with:
- **Normal faces**: green stroke (`#22c55e`), 2px width
- **Highlighted (spinning)**: accent color stroke, 3px width
- **Selected**: primary color stroke + 15% opacity fill, 4px width
- Labels drawn above boxes in white (primary-foreground for selected)

### `src/components/face-counter.tsx`

Minimal presentational component displaying `"{count} nguoi duoc phat hien"`.

### `src/components/random-picker-button.tsx`

Button component with three states:
- **idle**: "CHON" label, enabled
- **spinning**: "Dang chon..." with spinner animation, disabled
- **selected**: "CHON LAI" label, enabled

### `src/types/face.ts`

Core type definitions:
- `FaceBoundingBox` -- `{ x, y, width, height }` in pixel coordinates
- `DetectedFace` -- `{ id, label, boundingBox, confidence }`
- `PickerStateEnum` -- `{ IDLE: 'idle', SPINNING: 'spinning', SELECTED: 'selected' }`
- `PickerState` -- union type from `PickerStateEnum`

### `src/lib/human-config.ts`

@vladmandic/human configuration optimized for face-only detection:
- `backend: 'webgl'` -- GPU acceleration
- `face.detector`: blazeface model, max 8 faces, min confidence 0.5, frame skip enabled
- `face.mesh: enabled` -- required for face landmark detection (NOT `face.landmark`)
- All other models disabled: body, hand, object, gesture, segmentation, face description/emotion/antispoof/liveness/attention
- `modelBasePath: '/models/'` -- local model files from `public/models/`
- `cacheModels: true` -- persists models to IndexedDB after first load

### `src/lib/face-utils.ts`

Single utility: `formatFaceLabel(index)` -- returns `"Nguoi {index+1}"` (1-based Vietnamese labeling).

### `src/lib/utils.ts`

Standard shadcn/ui utility: `cn()` combining `clsx` + `tailwind-merge`.

## State Management

No external state library. All state is local React hooks:

```
App
  +- faces: DetectedFace[]          (from useFaceDetection)
  +- isLoading: boolean             (from useFaceDetection)
  +- error: string | null           (from useFaceDetection)
  +- pickerState: PickerState       (from useRandomPicker)
  +- selectedIndex: number | null   (from useRandomPicker)
  +- highlightedIndex: number | null (from useRandomPicker)
```

The `faces` array is passed down to `WebcamView` for canvas drawing. The `highlightedIndex` and `selectedIndex` control box styling during/after spin.

## Error Handling

| Scenario | Handling |
|----------|----------|
| Camera permission denied | Vietnamese error: "Quyen truy cap camera bi tu choi" |
| Camera not found | Vietnamese error: "Khong tim thay thiet bi camera" |
| Other camera errors | Vietnamese error: "Khong the khoi dong camera" |
| Detection frame error | Silently caught, loop continues |
| 0 faces detected | "CHON" button disabled |
| faceCount = 0 on triggerPick | Returns idle state, no crash |

## Build & Deployment

```
vite build
  -> dist/index.html
  -> dist/assets/index-*.js  (~1.8MB, includes TFJS + human)
  -> dist/assets/index-*.css (~25KB)
  -> dist/models/ (blazeface + facemesh, copied from public/)
```

The JS bundle is large (~1.8MB / ~485KB gzipped) due to TensorFlow.js and @vladmandic/human. This is expected for an offline ML app. Code-splitting is not applicable since everything is needed on first load.

## Testing Architecture

```
src/
  types/__tests__/face.test.ts           -- Type contract tests
  lib/__tests__/human-config.test.ts     -- Config validation tests
  lib/__tests__/face-utils.test.ts       -- Utility function tests
  hooks/__tests__/use-random-picker.test.ts -- Hook logic tests (fake timers)
  components/__tests__/face-counter.test.tsx    -- Component render tests
  components/__tests__/random-picker-button.test.tsx -- Button state tests
  components/__tests__/webcam-view.test.tsx     -- Video/canvas render tests
```

29 tests total, all passing. Tests use:
- `vitest` with `jsdom` environment
- `@testing-library/react` for component rendering
- `vi.useFakeTimers()` for spin animation logic
- No mocking of @vladmandic/human in tests (pure logic tests only)