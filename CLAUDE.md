# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (runs on port 3000)
- **Build:** `npm run build` (outputs to `build/`)
- **Preview production build:** `npm run preview`
- **Type check:** `npm run check`
- **Lint + format:** `npm run lint`
- **Format only:** `npm run format`
- **Run all tests:** `npm test`
- **Run tests in watch mode:** `npm run test:unit`
- **Run a single test file:** `npx vitest run src/lib/checker/domain.test.ts`
- **E2E tests (Docker):** `docker compose up --build --abort-on-container-exit --exit-code-from playwright`
- **E2E tests (local):** `npx playwright test` (requires app running on port 3000)

## Architecture

This is a **Svelte 5 + SvelteKit** app using **pure static CSR** (no SSR). It builds to static files via `@sveltejs/adapter-static` with `fallback: 'index.html'` so all routing happens client-side.

### Key config

- **`myconfig.js`** — Central place to set `projectName` for base path. Used by both `svelte.config.js` (SvelteKit `paths.base`) and `vite.config.ts` (Vite `base`). Empty string = root deploy, non-empty = subpath deploy (e.g., GitHub Pages project site).
- **`vite.config.ts`** — Vitest workspaces, Tailwind + SvelteKit plugins, `preview.allowedHosts` for Docker e2e.

### Test workspaces

Vitest is configured with two workspaces in `vite.config.ts`:

- **client** — jsdom environment, matches `src/**/*.svelte.{test,spec}.{js,ts}`, excludes `src/lib/server/**`
- **server** — node environment, matches `src/**/*.{test,spec}.{js,ts}`, excludes svelte test files

### Deployment

GitHub Pages via Docker build (`Dockerfile.build`) triggered on push to `main`. The workflow builds inside Docker and deploys the `build/` output.

## Verification

After every code modification, always run these two commands in order and fix any errors before considering the task done:

1. `npm run lint` — format + lint check
2. `npm run build` — ensure static build succeeds

## Design Principles

**Svelte components handle UI/UX only.** All business logic, data processing, and API calls must be extracted into pure TypeScript modules in `src/lib/`. Svelte files (`.svelte`) should only contain presentation, layout, user interaction, and state binding — never domain logic. This keeps logic testable without component rendering and framework-independent.

Example: `src/routes/+page.svelte` imports tutorial stores and engine modules from `$lib/` — the component just wires them together and renders results.

**Style with Tailwind utility classes directly in markup.** Use Tailwind v4 classes in Svelte templates. No custom CSS files or `<style>` blocks unless absolutely necessary. Global styles live in `src/app.css` (just the Tailwind import).

## E2E Testing (Playwright)

E2E tests run via Docker Compose with two services: `app` (Vite preview on port 3000) and `playwright` (Firefox browser tests).

- **Config:** `playwright.config.ts` — Firefox browser, 30s timeout, screenshots on, trace on retry
- **Tests:** `e2e/app.spec.ts` — 13 tests covering all UI panels and interactions
- **Screenshots:** Saved to `e2e/screenshots/` (8 screenshots captured during tests)
- **Docker:** `docker-compose.yml` + `Dockerfile.playwright` (based on `mcr.microsoft.com/playwright:v1.58.2-noble`)

### Test conventions

- All interactive elements must have `data-testid` attributes
- Naming: `data-testid="chapter-{id}"`, `data-testid="session-{id}"`, `data-testid="cell-btn-{row}-{col}"`, etc.
- Use `toHaveValue()` for `<textarea>` and `<input>`, `toContainText()` for other elements

## Code Style

- **Svelte 5 runes**: Use `$state()`, `$props()`, `$derived()`, `$effect()` — not legacy `let`/`export let`/`$:` reactivity
- **TypeScript** in strict mode
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin, imported in `app.css`
- **Prettier**: tabs, single quotes, no trailing commas, 100 char width
- **ESLint**: enforces `svelte/no-reactive-reassign`, `svelte/no-reactive-functions`, `svelte/require-store-reactive-access`, `svelte/no-immutable-reactive-statements`
