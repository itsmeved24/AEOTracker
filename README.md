## AEO Tracker

Track brand visibility across AI search engines (ChatGPT, Gemini, Claude, Perplexity, Google AI Overviews). Multi-tenant with Supabase auth/DB, simulated visibility checks, dashboards, analytics, and recommendations.

### Stack
- Next.js 15 (App Router), React 19, TypeScript
- Supabase (Auth + Postgres + RLS)
- Tailwind CSS v4 (CSS variables), Recharts, Lucide, Headless UI

---

## Database Schema

Tables (schema names omitted for brevity; see `src/types/database.ts`):

1) tenants
- id: uuid (PK)
- name: text (required)
- domain: text (nullable)
- created_at: timestamptz (default now)

2) projects
- id: uuid (PK)
- tenant_id: uuid (FK → tenants.id)
- name: text
- domain: text
- brand_name: text
- competitors: text[]
- created_at: timestamptz (default now)

3) keywords
- id: uuid (PK)
- project_id: uuid (FK → projects.id)
- keyword: text
- category: text (nullable)
- priority: int (1-3, optional)
- created_at: timestamptz (default now)

4) visibility_checks
- id: uuid (PK)
- keyword_id: uuid (FK → keywords.id)
- engine: text (one of: chatgpt, gemini, claude, perplexity, google_aio)
- presence: boolean
- position: int (nullable, 1-5 when present)
- answer_snippet: text (nullable)
- citations_count: int
- observed_urls: text[]
- sentiment: text (one of: positive, neutral, negative, nullable)
- timestamp: timestamptz (default now)
- metadata: jsonb (nullable)

Type source of truth: `src/types/database.ts`.

Row Level Security: enforced at the database level (not shown here). The app reads the user’s `tenant_id` from Supabase `app_metadata` and filters/inserts accordingly. Ensure your Supabase RLS policies restrict `projects`, `keywords`, and `visibility_checks` to the user’s tenant.

---

## Seed Data

Purpose: create a demo project, populate keywords, and generate 15 days of checks with realistic variation.

Script: `scripts/seed-data.ts`

Prereqs
1) Sign up once in the app (or create a tenant manually) so at least one row exists in `tenants`.
2) Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Run:
```
npm run seed
```

What it does
- Uses service role key (server-side only) to insert:
  - One demo `projects` row
  - ~40 sample `keywords`
  - For each of the past 15 days: visibility checks across all engines per keyword, inserted in batches

Generated patterns (see `generateVisibilityPattern`, `generateSnippet`, `generateUrls`):
- Presence probability adjusts by engine, keyword intent, weekday/weekend, and a mild trend.
- When `presence=true`, position is 1..5, citations_count is 0..3, and snippet/URLs are filled.

---

## Simulation Design

Two simulation paths exist:

1) Seeded History (offline simulation)
- In `scripts/seed-data.ts`, functions:
  - `generateVisibilityPattern(dayIndex, engine, keyword)` computes a presence baseline adjusted by:
    - Engine bonus (perplexity > chatgpt > claude/gemini > google_aio)
    - Keyword bonuses (e.g., keywords containing “best”, “software”)
    - Weekend dampening
    - Short upward trend over time
  - `generateSnippet(keyword, brandName, engine)` selects a templated, brand-aware answer snippet.
  - `generateUrls(domain, count)` emits realistic internal URLs.
- Inserts checks for each engine×keyword×day with timestamps at 09:00 local time to make charts look realistic.

2) On-demand Checks (runtime simulation)
- API route: `src/app/api/checks/run/route.ts`
- Input: `{ projectId: string, keywordIds: string[], engines: string[] }`
- For each keyword×engine, `simulateVisibilityCheck` generates:
  - presence, position (1..5), citations_count (0..3)
  - answer_snippet, observed_urls (1..3), sentiment
- Inserts into `visibility_checks` and returns count + message.

The runtime algorithm is simpler than the seed (uniform randomness with reasonable bounds) to prioritize responsiveness. The seed uses a richer heuristic to produce plausible day-over-day analytics (trend, engine differences, category bias).

---

## Local Development

Install deps and run:
```
npm install
npm run dev
```
Environment: `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Auth + Tenancy
- On signup, server creates a `tenants` row and a user with `app_metadata.tenant_id`.
- Middleware protects `/dashboard/*` and redirects logged-in users away from `/login` and `/signup`.

### Theme & UX
- Light/Dark via CSS variables + `ThemeProvider` and a pre-hydration script to prevent FOUC.
- Route progress with NProgress, animated transitions, and page-level skeletons.

---

## Project Scripts
- `npm run dev` — Next dev
- `npm run build` — Next build
- `npm run start` — Next start
- `npm run lint` — Lint
- `npm run seed` — Seed demo data (requires `.env.local` and at least one tenant)

---

## Troubleshooting
- Dark mode not applying: verify `<html>` contains `class="dark"` when toggled and that `--color-*` tokens map in `tailwind.config.ts` and `src/app/globals.css`.
- Seed fails: ensure `SUPABASE_SERVICE_ROLE_KEY` is set and there is at least one `tenants` row.
