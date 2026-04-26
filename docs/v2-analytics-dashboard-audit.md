# Analytics dashboard audit

## Goal
Prepare PR 12 without implementing analytics yet.

## Current dashboard state
- Route: `app/routes/admin/dashboard.tsx`
- Already shows operational moderation/admin data:
  - company counts by status
  - user counts by role
  - search/filter UI
  - company moderation actions
  - user role actions
- No analytics event collection yet.
- No analytics storage/query layer yet.
- No public traffic metrics exposed in dashboard yet.

## Recommendation
Split PR 12 into small sub-slices instead of shipping tracking + dashboard in one pass.

### PR 12A — audit and data design only
- define tracked events
- define event payload shape
- decide storage/provider strategy
- decide dashboard KPIs
- no runtime tracking code yet

### PR 12B — event collection
- add minimal public traffic events
- keep payload small and privacy-safe
- no dashboard UI changes unless needed for verification

### PR 12C — dashboard analytics widgets
- add KPI cards/charts/tables in admin dashboard
- keep existing moderation dashboard intact
- analytics should complement, not replace, moderation view

## Candidate public events
Keep first set small.

### Discovery
- homepage search opened
- homepage search used
- category filter clicked
- company page viewed

### Conversion intent
- sign-up CTA clicked
- company create CTA clicked
- outbound website clicked
- outbound email clicked
- outbound phone clicked
- outbound social clicked

## Recommended storage direction
Preferred first path: app DB table.

Why:
- current dashboard already reads app DB data
- simplest way to query analytics inside admin dashboard
- no extra provider integration needed for first implementation pass

### Future table
Suggested table: `analytics_events`

Suggested columns:
- `id`
- `name`
- `path`
- `company_slug` nullable
- `category_slug` nullable
- `source` nullable
- `visitor_id` nullable
- `metadata` JSONB nullable
- `created_at`

Notes:
- `visitor_id` needed if unique visitors by day/month matter
- without `visitor_id`, app can still count views/events by day/month
- keep payload minimal and privacy-safe

## Suggested event shape
```ts
{
  name: string
  path: string
  companySlug?: string
  categorySlug?: string
  source?: string
  visitorId?: string
  metadata?: Record<string, unknown>
  createdAt: string
}
```

Rules:
- no personal content payloads
- no raw search terms unless explicitly approved later
- no protected/admin route tracking in first pass
- no complex fingerprinting in first pass

## Event dictionary v1
### Discovery
- `homepage_search_opened`
- `homepage_search_used`
- `category_clicked`
- `company_viewed`

### Conversion intent
- `signup_cta_clicked`
- `company_create_cta_clicked`
- `company_website_clicked`
- `company_email_clicked`
- `company_phone_clicked`
- `company_social_clicked`

### Fields by event
- `homepage_search_opened`
  - `path`
  - `source`
- `homepage_search_used`
  - `path`
  - `source`
  - no raw query text in v1
- `category_clicked`
  - `path`
  - `categorySlug`
  - `source`
- `company_viewed`
  - `path`
  - `companySlug`
- outbound click events
  - `path`
  - `companySlug`
  - `source`

## Candidate dashboard KPIs
First KPI set:
- total public page views
- unique visitors by day/month if `visitor_id` exists
- company detail views
- top viewed companies
- top clicked outbound links
- sign-up CTA clicks
- category click counts

## Recommended dashboard integration
Keep current moderation dashboard intact.

Suggested future layout:
- view/tab/section for `Moderation`
- view/tab/section for `Analytics`

### Analytics section first pass
Top cards:
- total public page views
- unique visitors this month
- company page views
- outbound clicks
- sign-up CTA clicks

Tables below:
- top viewed companies
- top clicked outbound targets
- category click counts
- daily/monthly traffic summary

Reason:
- low-risk extension of existing dashboard
- avoids mixing moderation actions with analytics tables

## Open decision points
- where analytics data should live
  - app DB
  - external analytics provider
  - Cloudflare-native option
- retention period
- bot filtering strategy
- whether anonymous identifiers are needed at all
- whether dashboard needs charts or only tables/cards first

## Safe next implementation slice
When analytics work resumes:
1. add provider/storage decision
2. add 3 to 5 public events max
3. add simple KPI cards in admin dashboard
4. verify build and payload privacy
