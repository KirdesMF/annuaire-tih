import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { getDb } from "~/db";
import { analyticsEventsTable } from "~/db/schema/analytics";

export const getDashboardAnalytics = createServerFn({ method: "GET" }).handler(async () => {
  const events = await getDb()
    .select()
    .from(analyticsEventsTable)
    .orderBy(desc(analyticsEventsTable.createdAt));

  const uniqueVisitors = new Set(
    events.map((event) => event.visitorId).filter((visitorId): visitorId is string => Boolean(visitorId)),
  ).size;

  const companyViews = events.filter((event) => event.name === "company_viewed").length;
  const signupClicks = events.filter((event) => event.name === "signup_cta_clicked").length;
  const websiteClicks = events.filter((event) => event.name === "company_website_clicked").length;
  const categoryClicks = events.filter((event) => event.name === "category_clicked").length;

  return {
    totalEvents: events.length,
    uniqueVisitors,
    companyViews,
    signupClicks,
    websiteClicks,
    categoryClicks,
  };
});

export const dashboardAnalyticsQuery = queryOptions({
  queryKey: ["analytics", "dashboard"],
  queryFn: () => getDashboardAnalytics(),
});
