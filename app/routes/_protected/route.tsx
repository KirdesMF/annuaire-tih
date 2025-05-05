import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: "/sign-in" });
    }

    if (!context.user.cgu && location.pathname !== "/accept-cgu") {
      throw redirect({ to: "/accept-cgu" });
    }

    return { user: context.user };
  },
});

function ProtectedLayout() {
  return <Outlet />;
}
