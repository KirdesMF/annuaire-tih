import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import type { UserRole } from "~/db/schema/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" });
    const role = context.user.role as UserRole;

    if (role !== "admin" && role !== "superadmin") {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
