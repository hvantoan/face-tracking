# Codebase Summary

**Last updated:** 2026-06-01
**Branch:** feat/demo-app

---

## What Is This?

Offline browser app that detects faces via webcam and randomly picks a speaker using roulette-style animation. Vietnamese UI, zero cloud dependencies.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Face Detection | @vladmandic/human v3 (TFJS/WebGL) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Testing | Vitest 4 + @testing-library/react 16 + jsdom |

## Directory Layout

```
src/
  main.tsx                    # Entry point, mounts <App /> into #root
  App.tsx                     # Root orchestrator (hooks + layout)
  index.css                   # Tailwind v4 + shadcn theme (oklch colors)
  test-setup.ts               # Vitest global setup
  components/
    webcam-view.tsx           # <video> + <canvas> overlay
    face-box-overlay.tsx      # drawFaceBoxes() canvas renderer
    face-counter.tsx          # "{count} nguoi duoc phat hien"
    random-picker-button.tsx  # CHON / Dang chon... / CHON LAI
    ui/button.tsx             # shadcn/ui Button
    __tests__/                # Component render tests (3 files)
  hooks/
    use-face-detection.ts     # Human singleton, RAF loop, webcam start/stop
    use-random-picker.ts      # Roulette spin (ease-out deceleration)
    __tests__/                # Hook logic tests (1 file)
  lib/
    human-config.ts           # @vladmandic/human face-only config
    face-utils.ts             # formatFaceLabel() Vietnamese labels
    utils.ts                  # cn() (clsx + tailwind-merge)
    __tests__/                # Config + utility tests (2 files)
  types/
    face.ts                   # DetectedFace, FaceBoundingBox, PickerStateEnum
    __tests__/                # Type contract tests (1 file)
public/
  models/                     # blazeface + facemesh model files (offline)
scripts/
  copy-models.sh             # Copies models from node_modules to public/models/
```

## Source File Sizes

| File | Lines | Role |
|------|-------|------|
| App.tsx | ~60 | Root component, hook orchestration, layout |
| use-face-detection.ts | ~139 | Face detection hook (singleton, RAF, AbortController) |
| use-random-picker.ts | ~83 | Spin animation hook (ease-out, setTimeout-based) |
| face-box-overlay.tsx | ~58 | Canvas drawing function |
| webcam-view.tsx | ~40 | Video + canvas composite |
| random-picker-button.tsx | ~30 | Button with 3 states |
| face-counter.tsx | ~10 | Face count display |
| human-config.ts | ~35 | @vladmandic/human config object |
| face-utils.ts | ~3 | Single formatFaceLabel function |
| utils.ts | ~6 | cn() utility |
| face.ts | ~21 | Type definitions |
| index.css | ~130 | Tailwind v4 theme (oklch) |

## Test Coverage

29 tests across 7 test files, all passing:

| Test File | Tests | What It Tests |
|-----------|-------|---------------|
| face.test.ts | 2 | PickerStateEnum values, DetectedFace type contract |
| human-config.test.ts | 6 | Config: non-face models disabled, face models enabled, webgl backend, maxDetected |
| face-utils.test.ts | 2 | formatFaceLabel(0) = "Nguoi 1", formatFaceLabel(2) = "Nguoi 3" |
| use-random-picker.test.ts | 7 | Idle/spinning/selected states, timer-based deceleration, reset, zero-count edge case |
| face-counter.test.tsx | 3 | Renders Vietnamese count text |
| random-picker-button.test.tsx | 6 | Button labels per state, disabled state, click handlers |
| webcam-view.test.tsx | 2 | Video + canvas elements rendered |

## Key Architecture Patterns

1. **Module-level singleton** for `Human` instance -- avoids re-initializing TFJS models on React StrictMode remount
2. **AbortController** in `startDetection()` -- cancels in-flight async init on unmount
3. **requestAnimationFrame** for detection loop -- not setInterval
4. **Debounced picker reset** (500ms) in App.tsx -- prevents flicker when face count fluctuates
5. **`face.mesh`** (not `face.landmark`) -- correct @vladmandic/human v3 API property

## Build Output

```
dist/
  index.html
  assets/index-*.js    ~1.8MB (485KB gzipped) -- includes TFJS + human
  assets/index-*.css   ~25KB
  assets/geist-*.woff2  Geist Variable font files
  models/               Copied from public/models/
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Vite dev server with HMR
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run preview      # Preview production build
bash scripts/copy-models.sh  # Copy ML models to public/models/
```