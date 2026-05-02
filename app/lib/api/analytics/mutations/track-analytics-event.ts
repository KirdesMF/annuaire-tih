import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { getDb } from "~/db";
import { ANALYTICS_EVENT_NAMES, analyticsEventsTable } from "~/db/schema/analytics";

const TrackAnalyticsEventSchema = v.object({
  name: v.picklist(ANALYTICS_EVENT_NAMES),
  path: v.pipe(v.string(), v.maxLength(255)),
  companySlug: v.optional(v.pipe(v.string(), v.maxLength(100))),
  categorySlug: v.optional(v.pipe(v.string(), v.maxLength(100))),
  source: v.optional(v.pipe(v.string(), v.maxLength(100))),
  visitorId: v.optional(v.pipe(v.string(), v.maxLength(64))),
  metadata: v.optional(v.record(v.string(), v.unknown())),
});

export type TrackAnalyticsEventInput = v.InferOutput<typeof TrackAnalyticsEventSchema>;

export const trackAnalyticsEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => v.parse(TrackAnalyticsEventSchema, data))
  .handler(async ({ data }) => {
    try {
      await getDb().insert(analyticsEventsTable).values({
        name: data.name,
        path: data.path,
        companySlug: data.companySlug,
        categorySlug: data.categorySlug,
        source: data.source,
        visitorId: data.visitorId,
        metadata: data.metadata ?? null,
      });
    } catch {
      // Analytics failures must not break user-facing flows.
    }
  });
