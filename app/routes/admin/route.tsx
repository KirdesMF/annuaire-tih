import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { UserRole } from "~/db/schema/auth";

export const Route = createFileRoute("/admin")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
		const role = context.user.role as UserRole;

		if (role !== "admin" && role !== "superadmin") {
			throw redirect({ to: "/login" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
