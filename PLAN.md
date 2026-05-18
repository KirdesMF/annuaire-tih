# Better Auth Refactor Plan

## Goal

Clean Better Auth setup for TanStack Start on Cloudflare Workers while keeping request-scoped I/O safe.

## Non-goals

- Do not globalize `auth()` while DB/Hyperdrive clients are request-bound.
- Do not add `superadmin` to Better Auth admin roles yet.
- Do not replace current DB schema unless part of planned migration.

## 1. Dev database environment

Use a remote Supabase dev project, not local Supabase/OrbStack, as the default development database. This better matches production: Cloudflare Workers, Hyperdrive, Supabase pooler, SSL, preview deploys, and OAuth callback behavior.

Production Supabase and Cloudflare infrastructure should be owned by Annuaire TIH, not a personal account. Personal Supabase/Cloudflare resources can be used temporarily during setup only.

Actions:

- Create or move production Cloudflare account/zone/Workers/Hyperdrive to Annuaire TIH ownership before production launch.
- Create or move production database to an Annuaire TIH-owned Supabase organization/project before production launch.
- Create or move production Resend account/domain/API keys to Annuaire TIH ownership before production launch.
- Create or move production Cloudinary account/assets to Annuaire TIH ownership before production launch.
- Ensure domain registrar/DNS ownership is Annuaire TIH-owned before production launch.
- Create Google/LinkedIn OAuth apps under Annuaire TIH-owned accounts when social login is added.
- Keep GitHub repository under current personal account for now as a temporary exception; revisit before long-term handoff or team access.
- Create a separate Supabase project for development.
- Keep dev and production Supabase projects separate.
- Plan migration from any personal Supabase project to the Annuaire TIH-owned project if current data lives under a personal account.
- Plan migration from any personal Cloudflare account to the Annuaire TIH-owned account if current Workers/Hyperdrive/DNS live under a personal account.
- Create a separate Cloudflare Hyperdrive config for the dev Supabase database.
- Add Wrangler environments:
  - `dev` uses dev Hyperdrive.
  - `production` uses production Hyperdrive.
- During setup, use temporary local secret files only if required by Wrangler/local tooling, and keep them ignored by Git.
- Never store production DB credentials in `.dev.vars` or local env files.
- Make local Drizzle migrations use the dev database by default.
- Adopt Infisical after dev/prod environments, Hyperdrive, Cloudinary folders, and migrations are settled.
- Once adopted, use Infisical for local/dev/prod secret injection and remove long-lived local secret files.
- Keep production migrations manual/CI-only with explicit approval.
- Add dev seed script for safe fake data.
- Do not use local Supabase/OrbStack as the default. Keep it optional only for destructive migration experiments or disposable integration tests.

Validation:

- `bunx wrangler hyperdrive list` shows distinct dev and production configs.
- `bun dev` uses dev DB through temporary ignored local secrets first, then Infisical once adopted.
- `bunx wrangler deploy --env dev` uses dev DB.
- Production deploy uses production DB only.

## 2. Media environments

Use the current personal Cloudinary account during setup, but isolate app assets by folder namespace. Later, move Annuaire TIH to its own Cloudinary account. Once the dedicated account exists, folders should be environment-only (`dev/` and `prod/`) because the account itself will represent the app boundary.

Temporary folder structure in current personal Cloudinary account:

```txt
annuaire-tih/
  dev/
    users/
    companies/
  prod/
    users/
    companies/
```

Target folder structure in future Annuaire TIH Cloudinary account:

```txt
dev/
  users/
  companies/
prod/
  users/
  companies/
```

Actions:

- Add `CLOUDINARY_FOLDER` secret per environment.
- Temporary dev uses `CLOUDINARY_FOLDER=annuaire-tih/dev`.
- Temporary production uses `CLOUDINARY_FOLDER=annuaire-tih/prod`.
- Future dedicated Cloudinary account should use `CLOUDINARY_FOLDER=dev` and `CLOUDINARY_FOLDER=prod`.
- Update upload helpers to prefix all user/company uploads with `CLOUDINARY_FOLDER`.
- Ensure delete operations use the full `publicId` returned by Cloudinary.
- Plan one-time migration for existing production images into the chosen production folder before enforcing the new namespace.
- Do not move to Cloudflare R2 yet; revisit only if Cloudinary limits/costs become a problem.

## 3. Maintenance mode

Add maintenance handling before production launch.

App-level maintenance mode:

- Add `MAINTENANCE_MODE=false` env var per environment.
- Create `/maintenance` route.
- Redirect normal users to `/maintenance` when `MAINTENANCE_MODE=true`.
- Keep health endpoint available during maintenance.
- Decide whether admin users can bypass maintenance mode.
- Ensure API mutations return a clear maintenance error when enabled.

Cloudflare-level emergency fallback:

- Add a static Cloudflare fallback/redirect for cases where the app cannot boot.
- Use for DB outage, broken deploy, migration windows, or app-level maintenance failure.
- Keep this separate from app-level maintenance because app-level maintenance depends on the app runtime working.

## 4. Keep request-scoped auth setup

Current `auth()` factory is needed because Cloudflare Workers can throw request-bound I/O errors when clients created in one request are reused by another.

Actions:

- Keep `auth()` as function.
- Keep DB cache scoped with `WeakMap<Request, Db>`.
- Keep Hyperdrive as preferred connection in `auto` mode.
- Avoid module-level `betterAuth(...)` singleton.

## 5. Split auth server file

`app/lib/auth/auth.server.ts` currently owns too much.

Proposed files:

- `app/lib/auth/auth.server.ts` — compose Better Auth config only.
- `app/lib/auth/password.server.ts` — password hashing/verification helpers.
- `app/lib/auth/session.server.ts` — custom session enrichment.
- `app/lib/auth/emails.server.ts` — reset/welcome email helpers.
- `app/lib/auth/permissions.server.ts` — app authorization helpers.

## 6. Better Auth permissions

Build explicit permission model before adding `superadmin`.

Actions:

- Keep `admin({ adminRoles: ["admin"] })` for now.
- Use Better Auth admin plugin access control (`ac` + `roles`) for app-level RBAC.
- Define roles statically in auth config. Do not create arbitrary app roles from user input.
- Define app permissions by resource/action.
- Map Better Auth roles to permissions.
- Replace scattered role checks with permission checks.
- Add `superadmin` only after permission model is defined.
- Re-run Better Auth schema generation / Drizzle migration check after changing plugins or plugin schema.

Implementation shape:

```ts
import { createAccessControl } from "better-auth/plugins/access";
import { admin } from "better-auth/plugins/admin";

const ac = createAccessControl({
  company: ["create", "read-own", "update-own", "delete-own", "read-any", "update-any", "delete-any"],
  adminDashboard: ["view"],
  user: ["read-any", "update-any", "set-role", "delete-any"],
} as const);

const userRole = ac.newRole({
  company: ["create", "read-own", "update-own", "delete-own"],
  adminDashboard: [],
  user: [],
});

const adminRole = ac.newRole({
  company: ["create", "read-own", "update-own", "delete-own", "read-any", "update-any", "delete-any"],
  adminDashboard: ["view"],
  user: ["read-any", "update-any", "set-role", "delete-any"],
});

admin({
  adminRoles: ["admin"],
  defaultRole: "user",
  ac,
  roles: {
    user: userRole,
    admin: adminRole,
  },
});
```

Example permissions:

- `company:create`
- `company:read-own`
- `company:update-own`
- `company:delete-own`
- `company:read-any`
- `company:update-any`
- `company:delete-any`
- `user:set-role`
- `adminDashboard:view`

## 7. Role model cleanup

Actions:

- Keep DB default role as `user`.
- Keep Better Auth `admin` plugin `defaultRole: "user"` aligned with DB default.
- Keep public signup from accepting role input.
- Centralize role constants and permission mapping.
- Validate role changes server-side with a schema/union, not raw strings.
- Prevent privilege mistakes:
  - no self-demotion unless another admin exists
  - no removing the last admin
  - no assigning roles outside configured Better Auth `roles`
- Prefer Better Auth `auth().api.setRole` for admin role changes.

## 8. Signup flow fixes

Actions:

- Pass request headers to `auth().api.signUpEmail`.
- Handle Better Auth signup errors in client UI.
- Avoid returning silent `{ status: "error" }` without client handling.
- Ensure duplicate email shows friendly message.

## 9. Signup + CGU consistency

Current flow creates user, then inserts CGU acceptance. If CGU insert fails, user remains half-created.

Actions:

- Keep `user_cgu_acceptance` as the only source of truth for CGU acceptance.
- Treat `user.cgu` as deprecated legacy DB column; it is stale and not updated by current code.
- Add migration to drop deprecated `user.cgu` column after verifying no production code depends on it.
- Keep computed `user.cgu` only in Better Auth custom session payload/UI context.
- Wrap related DB writes where possible.
- If Better Auth user creation cannot share transaction, add compensation:
  - create user
  - insert CGU acceptance
  - if CGU insert fails, delete created user or mark onboarding incomplete
- Add tests or manual checks for failure paths.

## 10. Email handling

Use the current personal Resend account only during setup. Before production launch, move email sending to an Annuaire TIH-owned Resend account/domain.

Actions:

- Create a dedicated Annuaire TIH Resend account before production launch.
- Verify the Annuaire TIH sending domain, e.g. `annuaire-tih.fr`.
- Use project-owned senders such as `noreply@annuaire-tih.fr` and `support@annuaire-tih.fr`.
- Split Resend API keys by environment: dev and production.
- Move Resend calls to `emails.server.ts`.
- Add dev-safe email mode:
  - `EMAIL_MODE=log` logs reset/welcome links locally.
  - `EMAIL_MODE=resend` sends emails through Resend.
  - `EMAIL_FROM` controls sender per environment.
  - Dev can use Resend test sender: `Annuaire TIH <onboarding@resend.dev>`.
  - Optional `EMAIL_DEV_TO` redirects all dev emails to a controlled test inbox, e.g. `delivered+signup@resend.dev`.
- Current signup email is only a welcome/confirmation email; it does not verify ownership of the email address.
- Add Better Auth email verification flow before production:
  - configure `emailVerification.sendVerificationEmail`
  - enable verification email on signup
  - decide which protected actions require `emailVerified=true`
  - update UI for verification pending/resend flows
- Welcome email should not block successful signup.
- Log Resend errors with context.
- Reset password email can fail loudly, but message to user should stay generic.
- Add Better Auth `onExistingUserSignUp` callback to notify the account owner when someone tries to create a new account with an existing email address.
- Keep duplicate signup UI response generic enough to avoid account enumeration.

## 11. Password hashing

Current custom `scryptSync` works but blocks event loop.

Actions:

- Confirm whether custom hash is required for migrated users.
- If not required, use Better Auth default password hashing.
- If required, replace `scryptSync` with async `scrypt`.
- Keep malformed hash checks returning `false`.

## 12. Forgot/reset password hardening

Actions:

- Enforce reset password length server-side.
- Add max password length server-side.
- Return generic forgot-password success message.
- Avoid exposing raw Better Auth/provider errors to users.

## 13. Session enrichment performance

Current custom session reads role, active CGU, and acceptance on each session read.

Actions:

- Cache active CGU ID where safe.
- Consider checking CGU only on protected routes that need it.
- Keep session payload minimal.
- Avoid expensive session reads in root route when not needed.

## 14. Social sign-in

Add OAuth providers after core email/password flow is stable.

Providers:

- Google
- LinkedIn

Actions:

- Add Better Auth `socialProviders` config for Google and LinkedIn.
- Store provider client IDs/secrets in Cloudflare secrets, not `wrangler.jsonc`.
- Add local `.dev.vars` entries for development only.
- Configure OAuth callback URLs for local, preview, and production domains.
- Add sign-in buttons on sign-in and sign-up pages.
- Decide account-linking behavior when social email matches existing email/password user.
- Ensure social-created users get default role `user`.
- Ensure social-created users still complete CGU acceptance flow.
- Test provider failure/cancel flows.

## Validation checklist

After each refactor step:

- `bun run typecheck`
- `bun run check`
- Manual auth flow check:
  - signup
  - sign-in
  - forgot password
  - reset password
  - protected route redirect
  - admin route access
