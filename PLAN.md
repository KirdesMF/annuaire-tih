# Better Auth Refactor Plan

## Goal

Clean Better Auth setup for TanStack Start on Cloudflare Workers while keeping request-scoped I/O safe.

## Non-goals

- Do not globalize `auth()` while DB/Hyperdrive clients are request-bound.
- Do not add `superadmin` to Better Auth admin roles yet.
- Do not replace current DB schema unless part of planned migration.

## 1. Keep request-scoped auth setup

Current `auth()` factory is needed because Cloudflare Workers can throw request-bound I/O errors when clients created in one request are reused by another.

Actions:

- Keep `auth()` as function.
- Keep DB cache scoped with `WeakMap<Request, Db>`.
- Keep Hyperdrive as preferred connection in `auto` mode.
- Avoid module-level `betterAuth(...)` singleton.

## 2. Split auth server file

`app/lib/auth/auth.server.ts` currently owns too much.

Proposed files:

- `app/lib/auth/auth.server.ts` — compose Better Auth config only.
- `app/lib/auth/password.server.ts` — password hashing/verification helpers.
- `app/lib/auth/session.server.ts` — custom session enrichment.
- `app/lib/auth/emails.server.ts` — reset/welcome email helpers.
- `app/lib/auth/permissions.server.ts` — app authorization helpers.

## 3. Better Auth permissions

Build explicit permission model before adding `superadmin`.

Actions:

- Keep `admin({ adminRoles: ["admin"] })` for now.
- Define app permissions by domain/action.
- Map Better Auth roles to permissions.
- Replace scattered role checks with permission checks.
- Add `superadmin` only after permission model is defined.

Example domains:

- `company:create`
- `company:update:any`
- `company:update:own`
- `user:update:any`
- `user:delete:any`
- `admin:dashboard:view`

## 4. Role model cleanup

Actions:

- Keep DB default role as `user`.
- Keep public signup from accepting role input.
- Centralize role constants and permission mapping.
- Validate role changes server-side.

## 5. Signup flow fixes

Actions:

- Pass request headers to `auth().api.signUpEmail`.
- Handle Better Auth signup errors in client UI.
- Avoid returning silent `{ status: "error" }` without client handling.
- Ensure duplicate email shows friendly message.

## 6. Signup + CGU consistency

Current flow creates user, then inserts CGU acceptance. If CGU insert fails, user remains half-created.

Actions:

- Wrap related DB writes where possible.
- If Better Auth user creation cannot share transaction, add compensation:
  - create user
  - insert CGU acceptance
  - if CGU insert fails, delete created user or mark onboarding incomplete
- Add tests or manual checks for failure paths.

## 7. Email handling

Actions:

- Move Resend calls to `emails.server.ts`.
- Welcome email should not block successful signup.
- Log Resend errors with context.
- Reset password email can fail loudly, but message to user should stay generic.
- Add Better Auth `onExistingUserSignUp` callback to notify the account owner when someone tries to create a new account with an existing email address.
- Keep duplicate signup UI response generic enough to avoid account enumeration.

## 8. Password hashing

Current custom `scryptSync` works but blocks event loop.

Actions:

- Confirm whether custom hash is required for migrated users.
- If not required, use Better Auth default password hashing.
- If required, replace `scryptSync` with async `scrypt`.
- Keep malformed hash checks returning `false`.

## 9. Forgot/reset password hardening

Actions:

- Enforce reset password length server-side.
- Add max password length server-side.
- Return generic forgot-password success message.
- Avoid exposing raw Better Auth/provider errors to users.

## 10. Session enrichment performance

Current custom session reads role, active CGU, and acceptance on each session read.

Actions:

- Cache active CGU ID where safe.
- Consider checking CGU only on protected routes that need it.
- Keep session payload minimal.
- Avoid expensive session reads in root route when not needed.

## 11. Social sign-in

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
