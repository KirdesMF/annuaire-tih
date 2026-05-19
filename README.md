# Annuaire TIH

TanStack Start app deployed on Cloudflare Workers with Better Auth, Drizzle, Supabase Postgres, and Hyperdrive.

## Requirements

- Bun
- Wrangler auth configured
- Access to Cloudflare Hyperdrive configs
- Access to dev secrets provider once Infisical is configured

Install dependencies:

```bash
bun install
```

## Development

Default local app command:

```bash
bun run dev
```

Do not use production database for local development. Development should use remote Supabase dev database through dev secrets / generated local runtime vars.

## Database environments

This project uses separate remote Supabase databases:

- dev: `annuaire-tih-dev`
- production: `annuaire-tih`

Cloudflare Hyperdrive bindings are defined in one `wrangler.jsonc`:

- `WRANGLER_ENV=dev` → dev Worker and dev Hyperdrive
- `WRANGLER_ENV=production` → production Worker and production Hyperdrive

Do not keep production DB credentials in local env files.

## Build

```bash
bun run build:dev
bun run build:prod
```

`vite.config.ts` reads `WRANGLER_ENV` so the Vite build uses the correct Worker name and Hyperdrive binding. Deploy with Wrangler's native `--env` flag.

## Deploy

Deploy dev Worker:

```bash
bun run deploy:dev
```

Deploy production Worker:

```bash
bun run deploy:prod
```

Default deploy points to production:

```bash
bun run deploy
```

## Validation

Run before finishing code changes:

```bash
bun run typecheck
bun run check
```

## Notes

- Better Auth uses request-scoped `auth()` because Cloudflare Workers can reject I/O objects reused across requests.
- Hyperdrive handles DB connection routing/pooling, but does not make request-bound I/O globally reusable.
- Keep `tanstackStartCookies()` last in Better Auth plugins.
- Re-run Better Auth schema generation / Drizzle migration checks after changing Better Auth plugins or schema.
