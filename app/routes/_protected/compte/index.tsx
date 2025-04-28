import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/compte/")({
  beforeLoad: ({ location }) => {
    throw redirect({ to: "/compte/entreprises" });
  },
});
