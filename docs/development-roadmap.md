# Development Roadmap

**Last updated:** 2026-06-01
**Branch:** feat/demo-app

---

## Project: Face Tracking Speaker

Offline browser app that detects faces via webcam and randomly picks a speaker with roulette-style animation. Vietnamese UI, no cloud APIs.

---

## Phase Summary

| Phase | Name | Status | Date |
|-------|------|--------|------|
| 1 | Setup shadcn + Tailwind + @vladmandic/human | Complete | 2026-06-01 |
| 2 | Types & Config | Complete | 2026-06-01 |
| 3 | Face Detection Hook | Complete | 2026-06-01 |
| 4 | Random Picker Hook | Complete | 2026-06-01 |
| 5 | UI Components | Complete | 2026-06-01 |
| 6 | App Integration & Polish | Complete | 2026-06-01 |

---

## Phase Details

### Phase 1: Setup shadcn + Tailwind + @vladmandic/human

**Status:** Complete

- Vite 8 + React 19 + TypeScript 6 scaffold
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- shadcn/ui installed (Button component + theme)
- @vladmandic/human v3.3.6 installed
- Model files copied to `public/models/` (blazeface, facemesh)
- `vite.config.ts` configured with `optimizeDeps.include` for @vladmandic/human
- `vitest.config.ts` configured with jsdom environment

### Phase 2: Types & Config

**Status:** Complete

- `src/types/face.ts` -- `FaceBoundingBox`, `DetectedFace`, `PickerStateEnum`, `PickerState`
- `src/lib/human-config.ts` -- face-only detection config (webgl backend, blazeface model, max 8 faces, mesh enabled)
- `src/lib/face-utils.ts` -- `formatFaceLabel()` Vietnamese labels
- `src/lib/utils.ts` -- `cn()` utility from shadcn
- Type contract tests passing

### Phase 3: Face Detection Hook

**Status:** Complete

- `src/hooks/use-face-detection.ts` -- core face detection hook
- Module-level Human singleton (`getHuman()`) for StrictMode safety
- AbortController for async init cancellation on unmount/remount
- requestAnimationFrame detection loop
- Vietnamese error messages for camera permission denied / not found
- Webcam auto-start on mount, cleanup on unmount

### Phase 4: Random Picker Hook

**Status:** Complete

- `src/hooks/use-random-picker.ts` -- roulette-style selection hook
- Ease-out deceleration: initial 50ms interval * 1.15 factor per tick
- Total spin duration: 2500ms
- Random target selection on completion
- `triggerPick()` and `reset()` controls
- Debounced reset in App when face count changes (500ms)
- 7 unit tests with fake timers, all passing

### Phase 5: UI Components

**Status:** Complete

- `src/components/webcam-view.tsx` -- video + canvas overlay
- `src/components/face-box-overlay.tsx` -- `drawFaceBoxes()` canvas rendering
  - Green boxes for normal faces
  - Accent color for spinning highlight
  - Primary color fill for selected face
- `src/components/face-counter.tsx` -- "N nguoi duoc phat hien"
- `src/components/random-picker-button.tsx` -- "CHON" / "Dang chon..." / "CHON LAI"
- Component render tests all passing

### Phase 6: App Integration & Polish

**Status:** Complete

- `src/App.tsx` -- orchestrates hooks, auto-start webcam, debounced picker reset
- Mobile-friendly responsive layout (max-w-2xl, centered)
- Error banner with Vietnamese messages
- Loading indicator during model warmup
- 29 tests all passing
- Production build succeeds

---

## Milestones

| Milestone | Target | Achieved |
|-----------|--------|----------|
| Working face detection in browser | Phase 3 | 2026-06-01 |
| Roulette spin animation complete | Phase 4 | 2026-06-01 |
| All UI components rendered | Phase 5 | 2026-06-01 |
| Full app integration | Phase 6 | 2026-06-01 |
| 29 tests passing | Phase 6 | 2026-06-01 |
| Production build succeeds | Phase 6 | 2026-06-01 |

---

## Future Considerations (Not Currently Planned)

These are potential enhancements, **not committed work**. Only pursue if explicitly requested.

| Idea | Notes |
|------|-------|
| Sound effects during spin | Currently visual-only; could add beep on each tick |
| Dark mode toggle | CSS variables already support `.dark` class |
| Persist last selection | Would need localStorage or similar |
| Multi-camera support | Currently uses default camera |
| Face recognition (identity) | Would require face description model (currently disabled) |
| Progressive Web App | Add service worker for true offline + install |
| Bundle size optimization | Consider code-splitting TFJS if page load is critical |
| Accessibility audit | Add ARIA labels, keyboard navigation for picker |