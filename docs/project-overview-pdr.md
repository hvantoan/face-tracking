# Project Overview & Product Development Requirements

**Last updated:** 2026-06-01
**Status:** Implemented (v0.1.0)
**Branch:** feat/demo-app

---

## Overview

Offline browser app that detects faces via webcam and randomly picks a "speaker" using roulette-style spinning animation. 100% client-side -- no cloud APIs, no server, no network required after initial load.

**Vietnamese title:** "Chon Nguoi Phat Bieu" (Choose a Speaker)

## Problem Statement

In meetings, classrooms, or group activities, selecting the next speaker can be awkward and time-consuming. This app automates the process: detect all visible faces through the webcam, then randomly select one with a visual roulette animation that builds suspense.

## Core Requirements (PDR)

### Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-1 | Detect faces from webcam in real-time | P0 | Done |
| FR-2 | Draw bounding boxes around detected faces with Vietnamese labels ("Nguoi 1", "Nguoi 2", ...) | P0 | Done |
| FR-3 | Display face count in Vietnamese ("3 nguoi duoc phat hien") | P0 | Done |
| FR-4 | Randomly select a speaker via roulette-style spinning animation | P0 | Done |
| FR-5 | Spin animation uses ease-out deceleration (slows to a stop) | P0 | Done |
| FR-6 | Show selected face with distinct highlight (primary color fill) | P0 | Done |
| FR-7 | "CHON" button to trigger selection, "CHON LAI" after selection | P0 | Done |
| FR-8 | Handle webcam permission denied with Vietnamese error message | P0 | Done |
| FR-9 | Auto-start webcam on mount | P0 | Done |
| FR-10 | Auto-reset picker when face count changes (debounced 500ms) | P1 | Done |

### Non-Functional Requirements

| ID | Requirement | Target | Status |
|----|-------------|--------|--------|
| NFR-1 | Fully offline -- no cloud APIs | Zero network calls | Done |
| NFR-2 | Face detection latency | < 100ms per frame | Done |
| NFR-3 | Model loading time | ~20s first load, cached after | Done |
| NFR-4 | Max detected faces | 8 | Done |
| NFR-5 | Mobile-friendly responsive layout | Works on phone screens | Done |
| NFR-6 | Browser support | Modern Chromium (Chrome, Edge) | Done |

### Constraints

- **No cloud APIs** -- all ML models run locally in browser via TensorFlow.js (WebGL backend)
- **Vietnamese UI** -- all user-facing text is in Vietnamese
- **No sound** -- visual feedback only (spinning animation + color changes)
- **Single-page app** -- no routing, no persistence beyond session

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build tool | Vite | 8.x |
| Language | TypeScript | 6.x |
| Face detection | @vladmandic/human | 3.3.x |
| Styling | Tailwind CSS | 4.x |
| UI components | shadcn/ui | latest |
| Testing | Vitest | 4.x |
| Component testing | @testing-library/react | 16.x |
| Test environment | jsdom | 29.x |

## Key Architecture Decisions

1. **Module-level Human singleton** (`getHuman()`) -- survives React StrictMode double-mount, avoids re-initializing ML models on every remount
2. **AbortController** in `startDetection()` -- cancels in-flight init on unmount/remount
3. **requestAnimationFrame loop** for detection loop, React useEffect for canvas drawing
4. **Debounced face count reset** (500ms) -- prevents picker reset flicker when face count fluctuates
5. **Model files in `public/models/`** -- offline, no CDN dependency; filenames verified at install time
6. **`face.mesh`** (not `face.landmark`) -- correct API property name for @vladmandic/human v3
7. **WebGL backend** for TFJS inference -- best browser GPU performance

## User Flow

1. User opens app in browser
2. Browser requests camera permission
3. If denied: Vietnamese error message shown ("Quyen truy cap camera bi tu choi")
4. If granted: webcam feed displays with face bounding boxes
5. Each face labeled "Nguoi 1", "Nguoi 2", etc.
6. Face count shown below video ("3 nguoi duoc phat hien")
7. User clicks "CHON" button
8. Roulette animation spins through faces with ease-out deceleration over ~2.5s
9. Selected face highlighted with primary color fill
10. Button changes to "CHON LAI"
11. User can click again to re-select, or face count change auto-resets after 500ms debounce

## Risks & Mitigations

| Risk | Level | Mitigation |
|------|-------|------------|
| @vladmandic/human + Vite 8 bundle issues | Medium | `optimizeDeps.include` in vite.config.ts |
| Model loading ~20s warmup | Low | Loading indicator; `cacheModels: true` for IndexedDB |
| React 19 StrictMode double-mount | Medium | Module-level singleton + AbortController |
| Webcam permission denied | Medium | Vietnamese error message; graceful fallback UI |
| Canvas coordinate mismatch | Low | Set canvas resolution to video.videoWidth/Height |
| Face detection count fluctuation | Low | 500ms debounce before resetting picker |

## Success Metrics

- [ ] 29 unit tests pass
- [ ] Production build succeeds (`npm run build`)
- [ ] App works in modern Chromium browsers
- [ ] No console errors during normal operation
- [ ] Face detection visible within 20s of page load