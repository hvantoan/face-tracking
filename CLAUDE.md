# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- offline hoàn toàn, không cloud API, chỉ chạy trong browser

## Commands

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build production bundle: `npm run build`
- Lint: `npm run lint`
- Preview built app: `npm run preview`

No test runner is configured yet. Add a test script before using `npm test` or running a single test.

## Architecture

This is a Vite + React 19 + TypeScript single-page app.

- `src/main.tsx` is the browser entrypoint. It mounts `<App />` into `#root` under React `StrictMode`.
- `src/App.tsx` currently owns the full demo UI and local state.
- `src/App.css` styles the app component. `src/index.css` provides global styles imported by `main.tsx`.
- Static assets live in `src/assets/`; public root assets are referenced with absolute paths such as `/icons.svg`.
- `vite.config.ts` uses `@vitejs/plugin-react` with default Vite config.
- TypeScript build uses project references from `tsconfig.json` to `tsconfig.app.json` and `tsconfig.node.json`.
- ESLint uses flat config in `eslint.config.js`, combining JS recommended rules, TypeScript recommended rules, React Hooks rules, and Vite React Refresh rules.

## Notes

- Keep app code under `src/`; extract components/modules before `App.tsx` grows too large.
- Imports can include `.tsx` extensions because `allowImportingTsExtensions` is enabled.
- Current TypeScript settings reject unused locals/parameters and fallthrough switch cases during `npm run build`.
