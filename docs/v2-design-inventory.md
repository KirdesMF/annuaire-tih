# V2 design/token inventory

## Scope
Inventory for PR 1 on `chore/v2-design-tokens`. No visual rewrite yet.

## Global token source
File: `app/styles/app.css`

### Current semantic color tokens
Light + dark + system-dark variants exist for:

- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--popover` / `--popover-foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`
- `--error` / `--error-foreground`
- `--warning` / `--warning-foreground`
- `--info` / `--info-foreground`
- `--success` / `--success-foreground`
- `--border`
- `--input`
- `--ring`

### Current font tokens
- `--ui-font-sans`: system sans stack
- `--ui-font-serif`: Georgia/Cambria stack
- `--ui-font-mono`: system mono stack
- `--ui-font-luciole`: bundled `app/assets/font/Luciole-Regular.ttf`

Tailwind mappings:
- `font-sans`
- `font-serif`
- `font-mono`
- `font-luciole`

### Current radius tokens
- `--ui-radius: 0.5rem`
- `--radius-sm: calc(var(--ui-radius) - 4px)`
- `--radius-md: calc(var(--ui-radius) - 2px)`
- `--radius-lg: var(--ui-radius)`
- `--radius-xl: calc(var(--ui-radius) + 4px)`

### Current shadow tokens
- `--ui-shadow-2xs`
- `--ui-shadow-xs`
- `--ui-shadow-sm`
- `--ui-shadow`
- `--ui-shadow-md`
- `--ui-shadow-lg`
- `--ui-shadow-xl`
- `--ui-shadow-2xl`

Tailwind mappings exist for all above.

### Animation tokens
Radix-specific accordion animation still exists:
- `--animate-slide-down`
- `--animate-slide-up`

Uses Radix CSS vars:
- `--radix-accordion-content-height`

This becomes migration target during Base UI work.

## Token usage snapshot
Rough app-wide string counts, including definitions:

| Token/class fragment | Count | Status |
|---|---:|---|
| `primary` | 129 | heavily used |
| `primary-foreground` | 31 | used |
| `secondary` | 61 | used |
| `secondary-foreground` | 32 | used |
| `muted` | 102 | heavily used |
| `muted-foreground` | 86 | heavily used |
| `accent` | 41 | used mostly by UI primitives |
| `accent-foreground` | 15 | used |
| `destructive` | 49 | used |
| `error` | 119 | used for form/API feedback |
| `warning` | 14 | low use / aliases destructive today |
| `info` | 50 | used but aliases destructive today |
| `success` | 21 | used but aliases destructive today |
| `border` | 337 | heavily used |
| `input` | 83 | used |
| `ring` | 224 | heavily used/focus states |
| `font-luciole` | 4 | one real class use + definitions |
| `shadow-*` | 56+ | used |
| `rounded-sm` | 133 | dominant radius |
| `rounded-md` | 8 | low use |
| `rounded-lg` | 1 | very low use |
| `rounded-xl` | 0 | unused in app classes |

## Dead/weak token findings
- `warning`, `info`, `success` currently alias `destructive`; semantic meaning wrong for v2.
- `rounded-xl` mapped but no current app class usage.
- `font-serif` and `font-mono` mapped but little/no app usage beyond definitions.
- `font-luciole` used only on homepage card: `app/routes/index.tsx`.
- Radix animation vars in `app/styles/app.css` should not stay long-term after Base UI migration.

## Hardcoded / off-token styles
- `app/routes/index.tsx`: `bg-[#66C9F9]`, `text-black` on Luciole card.
- `app/routes/admin/dashboard.tsx`: many bespoke `black/white` classes (`bg-white`, `text-black`, `dark:bg-black`, etc.). Admin dashboard uses own visual system, likely out of PR 1 unless v2 wants admin included.

## Current primitive dependencies
From `package.json`:
- `radix-ui: ^1.4.1`
- `cmdk: ^1.1.1`
- `vaul: ^1.1.2`
- `sonner: ^2.0.3`

## Radix consumers
Direct `radix-ui` imports:

- `app/components/menu-user.tsx` — `Avatar`
- `app/components/site-footer.tsx` — `Separator`
- `app/components/ui/dialog.tsx` — `Dialog`
- `app/components/ui/dropdown-menu.tsx` — `DropdownMenu`
- `app/components/ui/popover.tsx` — `Popover`
- `app/components/ui/select.tsx` — `Select`
- `app/components/ui/tooltip.tsx` — `Tooltip`
- `app/routes/index.tsx` — `Separator`
- `app/routes/(public)/about.tsx` — `Separator`
- `app/routes/(public)/faq.tsx` — `Accordion`
- `app/routes/(public)/partners.tsx` — `Separator`
- `app/routes/(public)/sources.tsx` — `Separator`
- `app/routes/_protected/compte/route.tsx` — `Separator`
- `app/routes/_protected/compte/preferences.tsx` — `Avatar`, `RadioGroup`, `Separator`
- `app/routes/_protected/compte/entreprises/create/index.tsx` — `Popover`, `Separator`
- `app/routes/_protected/compte/entreprises/$slug/edit/infos.tsx` — `Popover`, `Separator`
- `app/routes/_protected/compte/entreprises/create/preview.tsx` — `Separator`
- `app/routes/_protected/compte/entreprises/$slug/edit/preview.tsx` — `Separator`

## cmdk consumers
- `app/components/ui/command.tsx`
- `app/routes/_protected/compte/entreprises/create/index.tsx`
- `app/routes/_protected/compte/entreprises/$slug/edit/infos.tsx`

## vaul consumers
- `app/components/ui/drawer.tsx`

## First-impression shell files
- `app/routes/__root.tsx`
- `app/components/site-header.tsx`
- `app/components/site-footer.tsx`
- `app/components/main-nav.tsx`
- `app/components/mobile-nav.tsx`
- `app/components/menu-user.tsx`

## V2 token draft requirements
Before PR 2, define:

1. Brand palette
   - stable light/dark values for background, surface, text, border
   - `primary` + readable `primary-foreground`
   - `secondary`, `accent`, `muted`
   - real `success`, `warning`, `info`, `error/destructive`

2. Typography
   - decide whether Luciole stays as brand/display/accessibility font
   - decide body stack and heading stack
   - document font loading strategy

3. Shape
   - choose radius scale; current UI heavily uses `rounded-sm`
   - avoid breaking dense form/admin UI unintentionally

4. Elevation
   - current shadows are generic gray/black and subtle
   - define surface/elevation rules for cards, popovers, dialogs, header

5. Focus/accessibility
   - keep `ring` high-contrast in light/dark
   - define focus ring width/style conventions

## Recommended next PR 1 output
- Keep this inventory doc.
- Review proposed v2 tokens in `docs/v2-token-proposal.md`.
- Do not rewrite `app/styles/app.css` until palette/font decisions are locked.
