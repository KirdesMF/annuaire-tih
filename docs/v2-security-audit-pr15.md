# PR 15 — Security authorization/logging audit

## Scope
Audit server-callable code paths after PR 1–12. Server functions are callable outside UI flows, so all authorization must happen server-side.

## Permission helpers
Added `app/lib/auth/permissions.server.ts`:
- `getCurrentUser()` returns current session user or `null`
- `requireCurrentUser()` rejects unauthenticated calls
- `requireAdminUser()` rejects non-admin/non-superadmin calls
- `requireCompanyManager(companyId)` rejects users who are not company owner or admin/superadmin
- `assertSelfOrAdmin(targetUserId, user)` rejects cross-user access unless admin/superadmin

## Authorization matrix
| Area | Action | Required permission | Server-side enforcement |
| --- | --- | --- | --- |
| Admin | update user role | admin/superadmin | `requireAdminUser()` |
| Admin | list users | admin/superadmin | `requireAdminUser()` |
| Analytics | dashboard stats | admin/superadmin | `requireAdminUser()` |
| Companies | create | authenticated user | `requireCurrentUser()`; client `user_id` ignored |
| Companies | update infos | owner or admin/superadmin | `requireCompanyManager(companyId)` |
| Companies | update media | owner or admin/superadmin | `requireCompanyManager(companyId)` + DB media `publicId` match |
| Companies | delete media | owner or admin/superadmin | `requireCompanyManager(companyId)` + DB media `publicId` match |
| Companies | delete company | owner or admin/superadmin | `requireCompanyManager(companyId)`; slug loaded from DB |
| Companies | update status | admin/superadmin | `requireAdminUser()` |
| Companies | list all statuses | admin/superadmin | `getCompanies({ status: "all" })` calls `requireAdminUser()` |
| Companies | list active public | public | default `getCompanies()` filters `active` |
| Companies | category non-active list | admin/superadmin | non-active status calls `requireAdminUser()` |
| Companies | pending/rejected by slug/id | owner or admin/superadmin | non-active company hidden from public users |
| Users | list own companies | self or admin/superadmin | `assertSelfOrAdmin()` |
| Users | update email/name/password/avatar | authenticated current user | `requireCurrentUser()` or existing session check |
| Users | delete account | current user only | rejects if payload userId differs from session user |
| CGU | accept | authenticated current user | client user id removed; server session user used |
| Auth | sign in/up/forgot/reset/sign out | auth API | no sensitive logs; sign in/up forward request headers |
| Analytics events | track public event | public | validated payload; failures swallowed to avoid UX breakage |

## Logging cleanup
Removed direct `console.*` usage from `app/lib` and `app/routes` touched in audit.

Removed/gated sensitive logs:
- reset-password email provider response
- Cloudinary upload/delete errors/details/folder paths
- signup email errors
- create company client error log
- server query catch-and-log patterns

## Tamper-resistance fixes
- Company creation no longer trusts form `user_id`; session user owns created record.
- Company deletion no longer trusts submitted `companySlug`; slug loaded from DB after authorization.
- Media update/delete verifies submitted `publicId` belongs to DB-stored company media before Cloudinary mutation.
- CGU acceptance no longer accepts user id input; session user is source of truth.
- Admin dashboard route has route-level admin guard in addition to server-function guards.

## Verification
- `bunx tsc --noEmit` passes.
- Biome lint passes on touched files.
- `bun run build` passes.

## Follow-up for PR 16/17
- Build still copies `.dev.vars` to `dist/server/.dev.vars`; PR 16 must add secret-artifact guard.
- Full repo lint still reports existing baseline diagnostics outside this PR; PR 16 must scope/fix lint signal.
- PR 17 should add automated tests for permission helpers and highest-risk mutation paths.
