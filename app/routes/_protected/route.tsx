import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
  beforeLoad: async ({ context }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login" });
    }
  },
});

function ProtectedLayout() {
  return <Outlet />;
}
