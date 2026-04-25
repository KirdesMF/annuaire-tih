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

## 2. Constraints
- App is TanStack Start + Vite + Cloudflare SSR.
- Root layout lives in `app/routes/__root.tsx`; global styling in `app/styles/app.css`.
- Current UI uses many shared wrappers in `app/components/ui/*` plus direct `radix-ui` imports in routes/components.
- shadcn/ui must be configured with Base UI as primitive base; do not add new Radix-based shadcn components.
- Use project package runner for shadcn CLI. If no `components.json` exists, initialize shadcn first with Base UI before applying theme/components.
- Public pages already exist; SEO work must not break auth/admin flows.
- Design refactor should stay incremental and safe; avoid one huge rewrite.
- Package removal must happen only after usage audit and replacement verification.
- Dynamic sitemap needs real route/data coverage, not hardcoded guesswork.

## 3. Branching strategy
Create branches in this order, each one built on last merged phase so conflict stays low:

1. `chore/annuaire-v2` → current working branch for audit + plan only.
2. `chore/v2-design-tokens` → token inventory, shadcn/Base UI setup plan, TweakCN theme capture, semantic CSS variables in `app/styles/app.css`.
3. `chore/v2-shadcn-theme` → initialize/configure shadcn with Base UI, apply TweakCN theme, verify global CSS/font/theme plumbing.
4. `chore/v2-shell-layout` → root layout, header, footer, nav, theme shell, and any token follow-up needed there.
5. `chore/v2-shadcn-base-ui` → migrate one primitive/component slice at time to shadcn/Base UI, only after shell and tokens stable.
6. `chore/v2-seo-sitemap` → SEO meta, dynamic sitemap, robots, accessibility baseline, after public routes are stable.
7. `chore/v2-feature-phase` → a11y tool, preview company page during register/update, profile picture.
8. `chore/v2-vertical-refactor` → domain re-org / colocation pass, only after UI + SEO work settle.
9. `chore/v2-improvement-audit` → infra/provider decisions and form flow audit at end.

Rule: do not start next branch before previous phase is merged or at least stabilized. That avoids parallel edits on same shell/components files and keeps conflicts small.

## 4. PR-sized checklist
- **PR 1**: design/token inventory + shadcn/Base UI migration inventory + TweakCN theme reference only.
- **PR 2**: shadcn init/config with Base UI + apply TweakCN theme + global CSS/font/theme plumbing.
- **PR 3**: install/adapt core shadcn components (`button`, `card`, `input`, `label`, `field`, `separator`, `badge`, `alert`, `avatar`, `tooltip`).
- **PR 4**: shell/layout refresh using shadcn components only (`__root`, header, footer, nav, menu, theme toggle).
- **PR 5**: shadcn/Base UI migration slice 1: dialog, popover, tooltip, dropdown/menu, avatar, separator.
- **PR 6**: shadcn/Base UI migration slice 2: select, drawer/sheet, accordion, command, toast/forms.
- **PR 7**: replace custom markup with shadcn patterns: Card, FieldGroup/Field, Alert, Empty, Badge, Skeleton where applicable.
- **PR 8**: SEO/meta + dynamic sitemap + robots.
- **PR 9**: public-page a11y pass + optional a11y tooling.
- **PR 10**: feature phase: preview company page, profile picture, a11y tool.
- **PR 11**: vertical codebase refactor, domain by domain.
- **PR 12**: improvement audit: Supabase vs Cloudflare D1, Cloudinary vs Cloudflare R2, register/update form flow.
- **PR 13**: dependency cleanup + final build/lint/typecheck.

## 5. Files likely involved
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

### Data sources for sitemap
- `app/lib/api/categories/queries/get-categories.ts`
- `app/lib/api/companies/queries/get-companies.ts`
- `app/lib/api/companies/queries/get-company-by-slug.ts`
- `app/db/schema/categories.ts`
- `app/db/schema/companies.ts`

### Refactor / vertical codebase phase
- `app/components/*` when regrouping by domain or by true shared UI
- `app/lib/*` when splitting shared business logic vs infrastructure
- `app/routes/*` when co-locating route-specific UI/data with each public or account domain
- any future `app/shared/*`, `app/design-system/*`, or `app/infrastructure/*` folders if introduced

### New likely files
- `app/routes/sitemap[.]xml.ts` or equivalent
- `public/robots.txt`
- optional accessibility tool/test helper files

## 6. Step-by-step plan
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

11. **SEO baseline pass**
   - add strong metadata to root and public routes: title, description, canonical, OG/Twitter if useful
   - note follow-up: improve category route SEO by replacing `?id=&name=` search-param dependency with canonical slug-based data loading, so `/categories/$slug` can generate dynamic title/description from category data safely
   - ensure heading hierarchy, landmark structure, meaningful alt text, and no empty labels
   - review focus states, skip paths, and keyboard access
   - fix obvious accessibility gaps on public pages first

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
   - keep each feature separate if it can ship alone

14. **Refactor toward vertical codebase**
   - regroup code by domain / ownership, not by technical type
   - co-locate route-specific data, UI, and helpers near routes/domains they serve
   - keep truly generic UI in a reusable design-system area
   - keep shared business logic in a shared area, infrastructure separate
   - move in small batches with import fixes and test coverage after each batch

15. **Improvement audit at end**
   - compare Supabase vs Cloudflare D1
   - compare Cloudinary vs Cloudflare R2
   - review register/update form flow and data model
   - only decide here after main UI/SEO/feature work settled

16. **Verification and cleanup**
   - run typecheck, lint, build
   - test public routes, auth flows, search, dialogs, mobile nav, theme toggle
   - confirm sitemap/robots response content
   - do final dead-code and dead-package sweep

## 7. Risks
- Token rewrite can break visual consistency across many routes fast.
- shadcn initialization can overwrite CSS/components if run with wrong preset/apply mode.
- Base UI migration may change behavior or accessibility semantics of overlays, menus, selects, and drawers.
- Removing `radix-ui` too early can break many wrappers at once.
- Sitemap can leak private/admin data if query filters are wrong.
- SEO changes can accidentally worsen UX if semantics or heading order are rushed.
- Small visual changes in root shell can affect every route, including auth pages.

## 8. Open questions
- Confirm TweakCN theme `https://tweakcn.com/themes/cmoevuz0m000304l18urs3r7j` is final source of truth.
- Which shadcn preset/apply mode should be used: overwrite, partial theme/font, merge, or skip component overwrite?
- Must shadcn/Base UI fully replace every Radix-adjacent pattern, or only direct `radix-ui` imports?
- Should sitemap include only active public companies and categories, or also static pages and legal pages?
- Do we want OG/Twitter metadata now, or just core SEO tags first?
- What form should optional accessibility tooling take: tests, lint, or runtime helper?
- Any pages to exclude from sitemap besides auth/admin/protected routes?

## 9. Suggested first change
Start with **shadcn/Base UI setup check + TweakCN theme capture**.
That is safest next step: confirm shadcn config/base, apply theme intentionally, then migrate shell/components onto shadcn patterns before touching feature routes.
