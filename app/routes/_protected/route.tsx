import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentCguAcceptanceFn } from "~/lib/api/cgu/queries/get-current-cgu-acceptance";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: "/sign-in" });
    }

    const hasAcceptedCgu = await getCurrentCguAcceptanceFn();

    if (!hasAcceptedCgu && location.pathname !== "/accept-cgu") {
      throw redirect({ to: "/accept-cgu" });
    }

    return { user: { ...context.user, cgu: hasAcceptedCgu } };
  },
});

function ProtectedLayout() {
  return <Outlet />;
}
