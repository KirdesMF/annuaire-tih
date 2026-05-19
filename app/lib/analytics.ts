import { nanoid } from "nanoid";
import type { TrackAnalyticsEventInput } from "~/lib/api/analytics/mutations/track-analytics-event";

const VISITOR_ID_KEY = "annuaire-tih-visitor-id";

export function getVisitorId() {
  if (typeof window === "undefined") return undefined;

  const existingVisitorId = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existingVisitorId) return existingVisitorId;

  const visitorId = nanoid();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}

export function createTrackedEvent(
  input: Omit<TrackAnalyticsEventInput, "visitorId" | "path">,
): TrackAnalyticsEventInput {
  return {
    ...input,
    path: typeof window === "undefined" ? "/" : window.location.pathname,
    visitorId: getVisitorId(),
  };
}
