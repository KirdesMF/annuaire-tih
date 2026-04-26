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

## Suggested event shape
```ts
{
  name: string
  path: string
  companySlug?: string
  categorySlug?: string
  source?: string
  createdAt: string
}
```

Rules:
- no personal content payloads
- no raw search terms unless explicitly approved later
- no protected/admin route tracking in first pass

## Candidate dashboard KPIs
First KPI set:
- total public page views
- company detail views
- top viewed companies
- top clicked outbound links
- sign-up CTA clicks
- category click counts

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
