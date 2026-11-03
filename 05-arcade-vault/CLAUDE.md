# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- No test runner is configured.

## Stack and conventions

- Next.js 16 (App Router, `app/` at repo root, no `src/`), React 19, TypeScript strict, Tailwind CSS v4. The path alias `@/*` maps to the repo root.
- **This Next.js has breaking changes from what you may know.** `AGENTS.md` requires reading the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heeding deprecation notices.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`. These change caching and rendering semantics, so check the docs before using data fetching or dynamic APIs.
- Tailwind is wired through Turbopack, not PostCSS: `next.config.ts` has a `turbopack.rules` entry that runs `@tailwindcss/turbopack` on `*.css`. Theme tokens (`--background`, `--foreground`, fonts) are defined in `app/globals.css` via `@theme inline`, with dark mode driven by `prefers-color-scheme`.
- `app/layout.tsx` uses the globally typed `LayoutProps<"/">` helper (no import) and loads Geist fonts through `next/font/google`.

## State

The project is a fresh `create-next-app` scaffold: `app/page.tsx` is still the default template, and the `references/` directory is empty. There is no application architecture yet.
