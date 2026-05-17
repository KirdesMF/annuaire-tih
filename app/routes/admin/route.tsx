import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isValidRole } from "~/db/schema/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" });
    const role = context.user.role;

    if (!isValidRole(role) || (role !== "admin" && role !== "superadmin")) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
