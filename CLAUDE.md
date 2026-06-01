# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Status

This repository currently appears to be empty: no source files, README, package manifests, build files, test configuration, Cursor rules, Copilot instructions, or existing project documentation were found during initialization.

## Project Rules

- Tech stack: Vite + React + TypeScript.
- The entire project must run in the browser/web environment.
- Do not use cloud APIs for application functionality.
- Prefer browser-native APIs and local/on-device processing where possible.

## Commands

No package manifest exists yet. Once the Vite React TypeScript app is initialized, expected commands are typically:

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`
- Run lint/type-check/test only after corresponding scripts are added to `package.json`.

## Architecture

Target architecture:

- Vite provides local dev server and production bundling.
- React + TypeScript provides the browser UI.
- All face-tracking functionality must execute client-side in the browser.
- Avoid server/backend dependencies unless explicitly needed for static asset delivery.
- Avoid cloud APIs; use local models, Web APIs, WebAssembly, Web Workers, or browser-compatible libraries instead.

Update this section after the initial implementation lands with:

- Entry points
- Source directory structure
- Data flow and major modules
- Testing layout
- External browser/runtime dependencies, if any

## Notes for Future Claude Instances

- Re-check the repository structure before starting work; this file was created when the repository had no discoverable implementation files.
- If a README or project docs are added later, summarize only the non-obvious operational details here rather than duplicating full documentation.
