# Project CORE

**C.O.R.E. — Custom Offline Resource Environment**. A framework web app for building, curating, and sharing personal offline environments. "No internet? No problem."

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/project-core run dev` — run the frontend (port 21910, served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, Framer Motion, Wouter routing
- API: Express 5, pino logging
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v3), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for the API contract
- `lib/db/src/schema/` — Drizzle schema (resources, packs, pack_resources, profiles, profile_resources, profile_packs)
- `artifacts/api-server/src/routes/` — Express route handlers (resources, packs, profiles, manifests, community, stats)
- `artifacts/project-core/src/` — React frontend (pages, components, theme)
- `artifacts/project-core/src/index.css` — CORE design system (dark-only, CORE palette)

## Architecture decisions

- OpenAPI-first: spec gates codegen which gates the frontend client hooks
- All integer OpenAPI types must use `type: number` (not `type: integer`) to avoid Orval generating `zod.int()` which doesn't exist in Zod v3
- Nullable number fields use `type: ["number", "null"]` — the same reason
- The app is dark-only: `class="dark"` on `<html>`, no light mode CSS variables needed
- Resources, packs, and profiles are all seeded with realistic CORE data

## Product

Project CORE is an open framework for building personal offline environments. The web app is the reference implementation and primary user experience with:
- **Atlas** — searchable resource catalogue across 16 categories
- **Packs** — 6 curated collections (Preparedness, Field, Knowledge, AI, Travel, Developer)
- **Builder** — multi-step interactive tool to define and save a custom CORE
- **Profiles** — public CORE configurations with manifest generation and JSON download
- **Community** — featured profiles and packs from the community

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- OpenAPI `type: integer` → Orval generates `zod.int()` which breaks Zod v3 typecheck. Always use `type: number` for integer fields in the spec.
- After editing `lib/db/src/schema/`, run `pnpm run typecheck:libs` before typechecking `artifacts/api-server` — stale declarations cause false TS2305 errors.
- The frontend is dark-only: use `class="dark"` on `<html>` in `index.html`, do NOT use `@apply dark` in CSS (not a valid Tailwind utility).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
