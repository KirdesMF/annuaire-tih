# Implementation Plan — Annuaire TIH v2

## 1. Goal
Rebuild app visual system from scratch for v2:
- move UI system to shadcn/ui with Base UI primitives
- apply approved TweakCN theme: https://tweakcn.com/themes/cmoevuz0m000304l18urs3r7j
- new colors and fonts from theme tokens
- replace direct Radix usage with shadcn/Base UI components
- audit/remove unused packages
- improve SEO + accessibility
- add dynamic sitemap
- optionally add tooling to push accessibility coverage as far as possible

## 2. Must improvements to track
- Remove local-only/generated junk from repo/worktree (`.DS_Store`, stale `dist`, caches) and keep `.gitignore` effective.
- Use `.env` as the only local secret file for Cloudflare local development; do not use `.dev.vars` in this project.
- Prevent secret files from shipping in build artifacts: `.env*` and any accidental `.dev.vars*` must never remain under `dist` after build.
- Fix lint signal: narrow Biome scan to source/config files, exclude build output/generated/vendor files, then fix real diagnostics.
- Update README: replace Bun init boilerplate with real TanStack Start/Vite/Cloudflare commands, env setup, build, deploy.
- Add safety scripts: `check`, typecheck-only, secret-artifact guard, optional clean script, and verified `cf-typegen` (`wrangler types`) workflow.
- Audit server-side authorization for all mutations: company create/update/delete/media, user updates, admin role/status actions.
- Remove unsafe logging: reset-password/auth data, Cloudinary delete logs, debug route logs; keep only intentional server logs.
- Add tests for validators, slug utilities, auth guards, company/user mutation authorization, analytics queries.
- Add CI to run format/lint/typecheck/build/tests before merge/deploy.
- Improve bundle/performance: lazy-load admin/devtools/heavy UI, audit large chunks and route-only dependencies.
- Refactor toward vertical/domain code organization after UI/SEO stabilization.
- Audit dependencies and remove dead packages only after verified no production references.

## 3. Constraints
- App is TanStack Start + Vite + Cloudflare SSR.
- Root layout lives in `app/routes/__root.tsx`; global styling in `app/styles/app.css`.
- Current UI uses many shared wrappers in `app/components/ui/*` plus direct `radix-ui` imports in routes/components.
- shadcn/ui must be configured with Base UI as primitive base; do not add new Radix-based shadcn components.
- Use project package runner for shadcn CLI. If no `components.json` exists, initialize shadcn first with Base UI before applying theme/components.
- Public pages already exist; SEO work must not break auth/admin flows.
- Design refactor should stay incremental and safe; avoid one huge rewrite.
- Package removal must happen only after usage audit and replacement verification.
- Dynamic sitemap needs real route/data coverage, not hardcoded guesswork.

## 4. Branching strategy
PR 1–12 are done. PR 13 and PR 14 are bonus/non-mandatory. Remaining mandatory work now prioritizes security and release hardening.

Create remaining branches in priority order, each one built on last merged phase so conflict stays low:

1. `security/v2-auth-logging-audit` → next mandatory PR (PR 15): server-side authorization audit for mutations/admin actions + unsafe log removal.
2. `security/v2-better-auth-cloudflare-hardening` → mandatory auth/runtime hardening (PR 16): Better Auth Cloudflare Worker config, secrets, origins, cookies, rate limit, email verification, and Hyperdrive/env usage.
3. `chore/v2-repo-hardening` → mandatory release hardening (PR 17): secret-artifact guard, README, check scripts, Biome scan scope, generated/local cleanup.
4. `test/v2-ci-baseline` → mandatory baseline (PR 18): focused tests for security-critical paths + CI for format/lint/typecheck/build/tests.
5. `chore/v2-dependency-cleanup` → mandatory final cleanup (PR 19): verified dead dependency removal + final build/lint/typecheck.
6. `feat/v2-analytics-implementation` → bonus PR 13: traffic custom events + web analytics surfaced in dashboard. Skip/defer unless explicitly chosen.
7. `refactor/v2-vertical-codebase` → bonus PR 14: vertical/domain refactor. Skip/defer unless explicitly chosen.
8. `chore/v2-improvement-audit` → optional PR 20: provider decisions and future data/form/search direction.

Rule: security and release hardening outrank bonus analytics/refactor work. It is valid to skip PR 13 and PR 14 now, then start PR 15.

## 5. PR-sized checklist
- **PR 1–12**: done (design system, shadcn/Base UI migration, SEO/sitemap/a11y/features, full UI refresh, analytics audit/design).
- **PR 13 — bonus analytics implementation**: traffic custom events + web analytics surfaced in dashboard. Optional, not release-blocking.
- **PR 14 — bonus vertical refactor**: vertical codebase refactor, domain by domain. Optional, not release-blocking.
- **PR 15 — mandatory security priority**: authorization/logging audit for server functions and admin actions.
  - verify company create/update/delete/media mutations require session + ownership/admin role server-side
  - verify user/profile updates cannot target other users unless admin path explicitly allows it
  - verify admin role/status actions require admin role server-side, not UI-only checks
  - remove or gate unsafe logs: auth/reset-password data, Cloudinary delete details, debug route logs
  - add focused tests or test seams for critical permission paths where practical
- **PR 16 — mandatory Better Auth + Cloudflare hardening**: explicit Better Auth `baseURL`/`secret`/`trustedOrigins`, Cloudflare env/bindings access, Hyperdrive usage, secure cookies, Cloudflare-aware rate limiting, email verification/change-email confirmation, password hash guard, and auth instance/config cleanup.
- **PR 17 — mandatory Cloudflare/repo hardening**: follow Cloudflare TanStack Start guide for bindings/type generation, switch local secrets to `.env` only, add `.env.example`, remove `.dev.vars` usage, run/document `bun run cf-typegen` (`wrangler types`), prefer typed `cloudflare:workers` `env` for Worker bindings/secrets where practical, add secret-artifact guard, README update, `.DS_Store`/cache cleanup, check scripts, Biome scan scope.
  - verify `vite.config.ts` has `cloudflare({ viteEnvironment: { name: "ssr" } })`
  - verify `wrangler.jsonc` has `main: "@tanstack/react-start/server-entry"`, `nodejs_compat`, observability, and declared bindings
  - decide whether generated Wrangler types are committed; if yes, keep them current in `check`/CI
  - document production secrets in Cloudflare dashboard/Worker secrets, not source-controlled files
  - document Workers Builds env setup and `CLOUDFLARE_INCLUDE_PROCESS_ENV=true` only when build-time secrets are needed
- **PR 18 — mandatory test/CI baseline**: validators, slug utilities, auth guards, mutation permission checks, build/lint/typecheck in CI.
- **PR 19 — mandatory dependency cleanup**: verified dead dependency removal + final build/lint/typecheck.
- **PR 20 — optional improvement audit**: Supabase vs Cloudflare D1, Cloudinary vs Cloudflare R2, register/update form flow, public search/filter data model (including future region filter).

## 6. Files likely involved
### Repo hardening / tooling
- `package.json`
- `README.md`
- `biome.json`
- `.gitignore`
- `.env.example`
- local `.env` (ignored; not committed)
- remove local `.dev.vars` usage for this project
- `vite.config.ts`
- `wrangler.jsonc`
- generated Cloudflare types from `bun run cf-typegen` / `wrangler types`
- future build/check scripts if scripts grow beyond inline package commands

### Core shell / theme / global style
- `app/routes/__root.tsx`
- `app/styles/app.css`
- `app/components/providers/theme-provider.tsx`
- `app/lib/theme.ts`
- `vite.config.ts` if plugin/config changes needed

### Navigation / layout
- `app/components/site-header.tsx`
- `app/components/site-footer.tsx`
- `app/components/main-nav.tsx`
- `app/components/mobile-nav.tsx`
- `app/components/menu-user.tsx`

### shadcn/Base UI config and wrappers
- `components.json` once initialized
- `app/styles/app.css`
- `app/lib/utils.ts` / existing `cn` utility if shadcn needs alignment

### Base UI / component wrappers
- `app/components/ui/dialog.tsx`
- `app/components/ui/dropdown-menu.tsx`
- `app/components/ui/popover.tsx`
- `app/components/ui/select.tsx`
- `app/components/ui/tooltip.tsx`
- `app/components/ui/drawer.tsx`
- `app/components/ui/command.tsx`
- `app/components/ui/input.tsx`
- `app/components/ui/label.tsx`
- `app/components/ui/toast.tsx`
- future shadcn components: `button`, `card`, `field`, `alert`, `badge`, `avatar`, `separator`, `skeleton`, `empty`, `sheet`/`drawer` if applicable

### Public pages / SEO
- `app/routes/index.tsx`
- `app/routes/(public)/about.tsx`
- `app/routes/(public)/faq.tsx`
- `app/routes/(public)/partners.tsx`
- `app/routes/(public)/sources.tsx`
- `app/routes/(public)/cgu.tsx`
- `app/routes/(public)/categories/$slug.tsx`
- `app/routes/(public)/entreprises/$slug.tsx`
- `app/routes/(auth)/*` only if global meta / accessibility patterns are shared
- future public search/filter follow-up likely touches homepage/public search UI and company search queries

### Data sources for sitemap
- `app/lib/api/categories/queries/get-categories.ts`
- `app/lib/api/companies/queries/get-companies.ts`
- `app/lib/api/companies/queries/get-company-by-slug.ts`
- `app/db/schema/categories.ts`
- `app/db/schema/companies.ts`

### Future public search/filter follow-up
- `app/routes/index.tsx`
- `app/lib/api/companies/queries/get-companies-by-term.ts`
- `app/lib/api/companies/queries/get-companies.ts`
- `app/db/schema/companies.ts`
- company create/update forms where structured `region` choice may replace or complement current area field

### Refactor / vertical codebase phase
- `app/components/*` when regrouping by domain or by true shared UI
- `app/lib/*` when splitting shared business logic vs infrastructure
- `app/routes/*` when co-locating route-specific UI/data with each public or account domain
- any future `app/shared/*`, `app/design-system/*`, or `app/infrastructure/*` folders if introduced

### New likely files
- `app/routes/sitemap[.]xml.ts` or equivalent
- `public/robots.txt`
- optional accessibility tool/test helper files

## 7. Step-by-step plan
1. **Inventory current design system**
   - list all current tokens in `app/styles/app.css`
   - map which tokens are used vs dead/legacy
   - list every `radix-ui` / `vaul` / `cmdk` consumer
   - identify shared shell components that define first impression

2. **Audit improvement opportunities**
   - review UI, SEO, a11y, performance, package usage, and code structure gaps
   - mark quick wins vs bigger refactors
   - note anything blocking v2 design or Base UI migration
   - turn findings into branch/PR scope, not big-bang work

3. **Define v2 design direction with TweakCN**
   - use TweakCN theme as source of truth: https://tweakcn.com/themes/cmoevuz0m000304l18urs3r7j
   - capture theme values/preset code via shadcn/TweakCN workflow, not manual guessing
   - decide font loading strategy from theme output
   - convert design choices into semantic tokens, not one-off classes

4. **Initialize/configure shadcn with Base UI**
   - verify whether `components.json` exists; if missing, initialize shadcn for this TanStack Start/Vite app
   - ensure shadcn `base` is Base UI, not Radix
   - use correct package runner (`bunx --bun shadcn@latest` if Bun is project runner; otherwise matching runner)
   - run `shadcn info --json` after setup and record config assumptions
   - apply TweakCN theme via shadcn preset/apply workflow when possible; do not decode preset manually

5. **Create new global theme foundation**
   - rewrite token layer in `app/styles/app.css` from shadcn/TweakCN output
   - keep semantic tokens stable (`background`, `foreground`, `primary`, etc.)
   - add/verify font loading and `font-display: swap`
   - verify light/dark/system behavior still works

6. **Install/adapt core shadcn components**
   - check installed components first, then add only needed components
   - get docs via `shadcn docs <component>` before using/migrating components
   - prefer shadcn components over custom styled markup
   - follow shadcn rules: semantic colors, `gap-*` not `space-*`, `size-*`, `cn()`, Field/FieldGroup for forms

7. **Refactor shell first**
   - update root layout, header, footer, nav, menu, theme toggle
   - make global shell reflect v2 brand
   - preserve routing and auth behavior
   - keep interactions keyboard-friendly

8. **Migrate component primitives from Radix to shadcn/Base UI**
   - replace wrappers one primitive at a time
   - start with low-risk components: separator, avatar, tooltip, popover, dropdown/menu
   - then dialog, select, drawer/sheet, accordion, command-style components, forms
   - update all consumers only after each primitive is stable
   - use shadcn composition rules: groups, titles for dialogs/drawers, AvatarFallback, Button icon conventions
   - delete old wrappers and imports once migrated

9. **Replace custom markup with shadcn patterns**
   - use `Card` composition for panels
   - use `Alert` for callouts
   - use `Empty` for empty states
   - use `Badge` for labels/status pills
   - use `Skeleton` for loading placeholders
   - use `FieldGroup` + `Field` for forms

10. **Audit packages and remove dead deps**
   - run dependency usage check after Base UI migration
   - likely candidates to remove or replace: `radix-ui`, possibly `vaul`, maybe `cmdk` if no longer needed
   - keep packages only if still referenced by production code
   - re-run build/lint after each removal

11. **SEO and accessibility baseline pass**
   - add strong metadata to root and public routes: title, description, canonical, OG/Twitter if useful
   - note follow-up: improve category route SEO by replacing `?id=&name=` search-param dependency with canonical slug-based data loading, so `/categories/$slug` can generate dynamic title/description from category data safely
   - ensure heading hierarchy, landmark structure, meaningful alt text, and no empty labels
   - review focus states, skip paths, and keyboard access
   - fix obvious accessibility gaps on public and auth pages first
   - defer company create/update form accessibility details to the feature/form improvement phase where those forms will be redesigned

12. **Add dynamic sitemap**
   - expose public static URLs
   - include dynamic category and company pages from DB queries
   - keep sitemap generation server-side and cacheable
   - use short browser cache and longer Cloudflare edge cache for sitemap responses
   - add static `public/robots.txt` pointing to sitemap
   - ensure unpublished/private records never leak into sitemap

13. **Feature phase**
   - build a11y tool
   - add preview company page during register/update
   - add profile picture support
   - follow-up: add hover/focus overlay on profile picture in `Préférences` to make avatar upload affordance obvious
   - keep each feature separate if it can ship alone

14. **Full app UI refresh phase**
   - replace images and logo assets with new design assets
   - review all pages against new design and update layouts/components/sections as needed
   - go beyond token changes: real screen/layout/component modifications and presentation updates
   - stabilize refreshed app UI before analytics work lands

15. **Analytics/dashboard audit phase**
   - done before remaining security/release work
   - keep analytics runtime implementation as bonus only

16. **Security and authorization audit — next mandatory phase**
   - inventory all server functions, form handlers, API route handlers, and mutations
   - verify every server mutation checks session server-side
   - verify company create/update/delete/media mutations enforce ownership or admin role server-side
   - verify user/profile updates cannot modify another user unless explicit admin path allows it
   - verify admin-only actions cannot be called by non-admin users via server function directly
   - remove or gate debug logs, especially auth/reset-password/cloudinary data
   - add focused tests or test seams for critical permission paths where practical

17. **Better Auth + Cloudflare Worker hardening — mandatory**
   - configure Better Auth with explicit `baseURL`, `secret`, and `trustedOrigins`; do not rely on request inference in production
   - store `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`/Hyperdrive connection, and email provider keys as Cloudflare secrets/bindings, not source-controlled config
   - prefer typed Cloudflare Worker `env`/bindings (`wrangler types`) over global `process.env` for server-side runtime config where practical
   - use existing `HYPERDRIVE` binding for Postgres connections or remove binding if intentionally unused; avoid bypassing Hyperdrive accidentally
   - enable/confirm production secure cookies with `advanced.useSecureCookies: true` unless local/dev path requires override
   - configure Better Auth IP detection for Cloudflare with `advanced.ipAddress.ipAddressHeaders: ["cf-connecting-ip"]` and IPv6 subnet rate limiting
   - enable explicit auth rate limiting in production and add stricter rules for sign-in, sign-up, forgot-password, reset-password, and admin-sensitive endpoints where supported
   - add email verification for sign-up (`requireEmailVerification`) and explicit change-email confirmation before `changeEmail.enabled` remains active
   - harden custom password verification against malformed stored hashes and buffer length mismatch before `timingSafeEqual`
   - remove custom password helper if no legacy hash compatibility needs it; Better Auth default already uses scrypt
   - avoid rebuilding full Better Auth config unnecessarily per request; split static options from per-env/per-db setup and memoize safely only when compatible with Worker isolates
   - keep `/api/auth/$` route first-party under app domain to avoid Safari third-party cookie issues

18. **Repo hardening and safety cleanup — mandatory**
   - verify Cloudflare TanStack Start guide alignment: Vite Cloudflare plugin uses `cloudflare({ viteEnvironment: { name: "ssr" } })`, `wrangler.jsonc` uses `main: "@tanstack/react-start/server-entry"`, `nodejs_compat`, observability, and package scripts include `cf-typegen: "wrangler types"`
   - run `bun run cf-typegen` and commit/update generated Cloudflare types if the project tracks them; document where the generated file lives
   - follow Cloudflare bindings docs: prefer `cloudflare:workers` `env` for Worker bindings/secrets in server-side code where practical, with generated `wrangler types` for typed bindings
   - use `.env` as the only local secret file, per Cloudflare local development docs; delete/stop using `.dev.vars` and do not keep both files active
   - add `.env.example` with fake required keys and no real secrets
   - update `.gitignore` to ignore `.env*` while allowing `.env.example`, and also ignore `.dev.vars*` to catch accidental files
   - remove `.DS_Store` and other local/generated junk from worktree
   - prevent `.env*` and accidental `.dev.vars*` from remaining in `dist` after build
   - add deploy/build guard that fails if secret files are found in build output
   - update README with real dev/build/deploy/env docs, including `bun run cf-typegen`, Cloudflare dashboard/secrets for production, Workers Builds env setup if build-time secrets are needed, and `CLOUDFLARE_INCLUDE_PROCESS_ENV=true` only for CI/build-time env access when needed
   - add `check` script and clean script if useful
   - tune Biome includes/excludes so lint reports actionable source diagnostics

19. **Test and CI baseline — mandatory**
   - add focused tests for validators, slug utilities, auth guards, server mutation permissions, analytics query behavior if analytics is implemented
   - add CI for format/lint/typecheck/build/tests
   - keep tests behavior-focused and colocated where practical

20. **Verification and dependency cleanup — mandatory**
   - run typecheck, lint, build
   - test public routes, auth flows, search, dialogs, mobile nav, theme toggle
   - confirm sitemap/robots response content
   - do final dead-code and dead-package sweep
   - remove dead deps only after verified no production references remain

21. **Analytics/dashboard implementation — bonus**
   - surface analytics in dashboard only if time remains
   - add traffic custom events only after security/release hardening are done
   - keep privacy-safe payload shape from PR 12 audit/design

22. **Refactor toward vertical codebase — bonus**
   - regroup code by domain / ownership, not by technical type
   - co-locate route-specific data, UI, and helpers near routes/domains they serve
   - keep truly generic UI in a reusable design-system area
   - keep shared business logic in a shared area, infrastructure separate
   - move in small batches with import fixes and test coverage after each batch

23. **Improvement audit at end — optional**
   - compare Supabase vs Cloudflare D1
   - compare Cloudinary vs Cloudflare R2
   - review register/update form flow and data model
   - review public search improvements, especially structured filters for companies
   - plan future company `region` field from controlled list so public search can filter by area/region
   - decide whether current free-text `service_area` field stays as complementary info or should be replaced/migrated toward structured region data

## 8. Risks
- Token rewrite can break visual consistency across many routes fast.
- shadcn initialization can overwrite CSS/components if run with wrong preset/apply mode.
- Base UI migration may change behavior or accessibility semantics of overlays, menus, selects, and drawers.
- Removing `radix-ui` too early can break many wrappers at once.
- Sitemap can leak private/admin data if query filters are wrong.
- SEO changes can accidentally worsen UX if semantics or heading order are rushed.
- Small visual changes in root shell can affect every route, including auth pages.
- Cloudflare/Vite build can copy local secret files into `dist`; `.env*` and any accidental `.dev.vars*` must be guarded.
- Server functions are callable outside UI flows; missing server-side authorization becomes security bug.

## 9. Open questions
- Confirm TweakCN theme `https://tweakcn.com/themes/cmoevuz0m000304l18urs3r7j` is final source of truth.
- Which shadcn preset/apply mode should be used: overwrite, partial theme/font, merge, or skip component overwrite?
- Must shadcn/Base UI fully replace every Radix-adjacent pattern, or only direct `radix-ui` imports?
- Should sitemap include only active public companies and categories, or also static pages and legal pages?
- Do we want OG/Twitter metadata now, or just core SEO tags first?
- What form should optional accessibility tooling take: tests, lint, or runtime helper?
- Any pages to exclude from sitemap besides auth/admin/protected routes?
- Should secret artifact removal be handled by inline package script, dedicated script, or Vite `closeBundle` plugin?
- Which test runner should become project baseline: Bun test or Vitest?
- Should generated Wrangler types be committed, and should `check` run `bun run cf-typegen` or only verify existing generated types are current?

## 10. Suggested next change
Finish **PR 15: security authorization/logging audit**, then continue in this order:

1. **PR 16: Better Auth + Cloudflare Worker hardening**
   - explicit Better Auth `baseURL`, `secret`, `trustedOrigins`
   - Cloudflare-aware cookies, IP/rate-limit config, email verification/change-email confirmation
   - Hyperdrive/env access cleanup and password hash guard
2. **PR 17: Cloudflare/repo hardening**
   - switch local secrets to `.env` only and remove `.dev.vars` usage
   - add `.env.example` and update `.gitignore`
   - verify TanStack Start Cloudflare guide alignment
   - run/document `bun run cf-typegen` (`wrangler types`) and generated bindings types
   - prefer `cloudflare:workers` `env` for Worker bindings/secrets where practical
   - add secret artifact guard for `dist/**/.env*` and accidental `dist/**/.dev.vars*`
   - update README scripts/env/build/deploy docs
