import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/compte/")({
  beforeLoad: () => {
    throw redirect({ to: "/compte/entreprises" });
  },
});
