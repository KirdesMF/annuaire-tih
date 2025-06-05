import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit/")({
  beforeLoad: ({ location, params, context }) => {
    throw redirect({
      to: "/compte/entreprises/$slug/edit/infos",
      params,
      search: { id: context.user.id },
    });
  },
});
