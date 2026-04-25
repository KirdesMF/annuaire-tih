# V2 token proposal

## Direction
Warm, trustworthy public-service directory. Soft paper background, ink text, terracotta primary, amber secondary, blue info. Keep UI calm and accessible; no neon brand surface except intentional accent cards.

## Token strategy
Keep existing semantic names so app classes survive PR 2:

- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`, `destructive-foreground`
- `error`, `error-foreground`
- `warning`, `warning-foreground`
- `info`, `info-foreground`
- `success`, `success-foreground`
- `border`, `input`, `ring`

Add optional raw palette vars later only if useful (`--brand-*`, `--surface-*`). Do not force now.

## Light theme draft
Use OKLCH in CSS.

```css
:root {
  --background: oklch(0.985 0.012 86);
  --foreground: oklch(0.245 0.028 54);

  --card: oklch(0.998 0.006 86);
  --card-foreground: oklch(0.245 0.028 54);
  --popover: oklch(0.998 0.006 86);
  --popover-foreground: oklch(0.245 0.028 54);

  --primary: oklch(0.485 0.105 42);
  --primary-foreground: oklch(0.99 0.008 86);

  --secondary: oklch(0.91 0.085 82);
  --secondary-foreground: oklch(0.315 0.055 48);

  --muted: oklch(0.94 0.018 78);
  --muted-foreground: oklch(0.47 0.028 58);

  --accent: oklch(0.9 0.05 190);
  --accent-foreground: oklch(0.265 0.05 205);

  --destructive: oklch(0.58 0.19 28);
  --destructive-foreground: oklch(0.99 0.006 86);
  --error: var(--destructive);
  --error-foreground: var(--destructive-foreground);

  --warning: oklch(0.72 0.14 75);
  --warning-foreground: oklch(0.25 0.035 54);
  --info: oklch(0.58 0.115 230);
  --info-foreground: oklch(0.99 0.006 86);
  --success: oklch(0.56 0.12 145);
  --success-foreground: oklch(0.99 0.006 86);

  --border: oklch(0.86 0.018 78);
  --input: oklch(0.88 0.016 78);
  --ring: oklch(0.52 0.13 42);
}
```

## Dark theme draft
```css
[data-theme="dark"] {
  --background: oklch(0.17 0.018 54);
  --foreground: oklch(0.94 0.018 82);

  --card: oklch(0.205 0.02 54);
  --card-foreground: oklch(0.94 0.018 82);
  --popover: oklch(0.205 0.02 54);
  --popover-foreground: oklch(0.94 0.018 82);

  --primary: oklch(0.74 0.105 62);
  --primary-foreground: oklch(0.18 0.024 54);

  --secondary: oklch(0.28 0.04 62);
  --secondary-foreground: oklch(0.9 0.07 82);

  --muted: oklch(0.255 0.018 54);
  --muted-foreground: oklch(0.74 0.018 82);

  --accent: oklch(0.31 0.055 205);
  --accent-foreground: oklch(0.88 0.055 190);

  --destructive: oklch(0.66 0.17 28);
  --destructive-foreground: oklch(0.99 0.006 86);
  --error: var(--destructive);
  --error-foreground: var(--destructive-foreground);

  --warning: oklch(0.78 0.13 75);
  --warning-foreground: oklch(0.18 0.024 54);
  --info: oklch(0.72 0.105 230);
  --info-foreground: oklch(0.16 0.03 235);
  --success: oklch(0.7 0.12 145);
  --success-foreground: oklch(0.15 0.03 145);

  --border: oklch(0.31 0.018 54);
  --input: oklch(0.34 0.018 54);
  --ring: oklch(0.78 0.12 62);
}
```

`[data-theme="system"]` dark media block should mirror dark values exactly.

## Typography draft
Keep Luciole, but stop using as one-off novelty.

- Body: `--ui-font-sans`, keep current system stack for perf/reliability.
- Brand/accessibility/display: `--ui-font-luciole`, use for logo/hero callouts only.
- Mono: keep current stack for technical/admin bits.
- Serif: keep mapped only if future editorial pages need it; otherwise candidate for cleanup after v2.

Font loading changes for PR 2:

```css
@font-face {
  font-family: "Luciole";
  src: url("../assets/font/Luciole-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Radius draft
Current UI uses mostly `rounded-sm`. Keep compact shape but make system clearer.

```css
--ui-radius: 0.625rem;
--radius-sm: calc(var(--ui-radius) - 6px); /* 4px */
--radius-md: calc(var(--ui-radius) - 2px); /* 8px */
--radius-lg: var(--ui-radius);             /* 10px */
--radius-xl: calc(var(--ui-radius) + 6px); /* 16px */
```

Rules:
- `rounded-sm`: buttons, inputs, badges, dense controls
- `rounded-md`: cards in forms/lists
- `rounded-lg`: dialogs/popovers/feature cards
- `rounded-xl`: hero/marketing panels only

## Shadow draft
Keep subtle. Avoid heavy SaaS glow.

```css
--ui-shadow-2xs: 0 1px 2px hsl(30 20% 20% / 0.04);
--ui-shadow-xs: 0 1px 2px hsl(30 20% 20% / 0.06);
--ui-shadow-sm: 0 1px 3px hsl(30 20% 20% / 0.08), 0 1px 2px hsl(30 20% 20% / 0.05);
--ui-shadow: 0 4px 12px hsl(30 20% 20% / 0.08);
--ui-shadow-md: 0 8px 20px hsl(30 20% 20% / 0.1);
--ui-shadow-lg: 0 14px 32px hsl(30 20% 20% / 0.12);
--ui-shadow-xl: 0 20px 44px hsl(30 20% 20% / 0.14);
--ui-shadow-2xl: 0 28px 64px hsl(30 20% 20% / 0.18);
```

Dark can reuse these; if too flat, PR 2 may switch to black alpha.

## Focus/accessibility rules
- Use `ring` token for all focus-visible states.
- Default: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` or equivalent ring utilities.
- Do not rely on color alone for errors/success.
- `primary-foreground`, `info-foreground`, `success-foreground`, `destructive-foreground` must pass contrast on filled backgrounds.

## Surface rules
- Page background: `background`
- Cards/forms: `card`
- Menus/dialogs/popovers: `popover`
- Inputs: `background` + `border-input`; disabled inputs use `muted`
- Secondary callouts: `secondary`
- Informational callouts: `info` or `accent`, not hardcoded blue

## PR 2 implementation notes
- Rewrite values in `app/styles/app.css` only.
- Keep token names stable.
- Add `font-display: swap` to Luciole.
- Replace `warning/info/success` aliases with real values.
- Duplicate dark values into system dark media block.
- Leave Radix animation vars until Base UI PR unless causing no-use lint/noise.

## Open decision before merge
Do we want terracotta/amber/blue direction final? If yes, PR 2 can apply. If no, replace OKLCH values here first, not in components.
