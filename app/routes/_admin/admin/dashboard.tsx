import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<div className="container px-4 py-6">
				<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			</div>
		</main>
	);
}
