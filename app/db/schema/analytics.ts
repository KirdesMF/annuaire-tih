import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const ANALYTICS_EVENT_NAMES = [
  "company_viewed",
  "category_clicked",
  "signup_cta_clicked",
  "company_website_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsEventMetadata = Record<string, unknown>;

export const analyticsEventsTable = pgTable("analytics_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  name: varchar("name", { length: 64 }).$type<AnalyticsEventName>().notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  companySlug: varchar("company_slug", { length: 100 }),
  categorySlug: varchar("category_slug", { length: 100 }),
  source: varchar("source", { length: 100 }),
  visitorId: varchar("visitor_id", { length: 64 }),
  metadata: jsonb("metadata").$type<AnalyticsEventMetadata | null>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
