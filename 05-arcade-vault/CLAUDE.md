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

## Project intent

Arcade Vault is a platform to play games online and compete for the highest score. The README says development follows spec-driven design (`/spec` and `/spec-impl` skills from `Klerith/fernando-skills`, installed with `npx skills@latest add Klerith/fernando-skills`).

## State

The project is still a fresh `create-next-app` scaffold: `app/page.tsx` is the default template and there is no application architecture yet. The first approved spec, `specs/01-mvp-pantallas-visuales.md` (status "Aprobado"), defines the planned architecture: route groups `(portal)` (with nav bar) and `(player)` (without), mock data in `lib/`, a client `SessionProvider` backed by `localStorage` (`av_user`, `av_scores`), and no game engine.

## Spec workflow

- Specs live in `specs/NN-slug.md` (Spanish, with a `**Status:**` line). `specs/.spec-config.yml` sets `AutoCreateBranch`.
- `/spec-impl <spec>` only works on specs whose status means "Approved". It creates the branch `spec-NN-slug`, implements the numbered plan one step at a time, and pauses after each step for review.
- Never commit automatically during `/spec-impl`; the user commits. Implement exactly what the spec says, and put changes of scope in the spec, not in the code.
- Uncommitted changes in the working tree (for example an untracked `specs/`) should be committed or stashed by the user before the branch switch.

## Design reference

`refereces/` (sic, misspelled; tracked in git) holds a Claude Design handoff bundle, `arcade-vault-retro-portal/`. The primary design is `project/Arcade Vault.dc.html`, with a "nocturne" design system under `project/_ds/` (`styles.css`, `readme.md`, `_ds_bundle.js`) and `project/support.js`. These are HTML/CSS/JS prototypes to recreate in React/Tailwind, not code to copy. The bundle README says to read the main HTML file in full and follow its imports before implementing, to ask the user when scope is ambiguous, and not to render or screenshot the prototypes unless asked.

## Skills

Usa siempre /frontend-desing para hacer cualquier interfaz de usuario.
