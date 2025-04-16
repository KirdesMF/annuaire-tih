import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/preview")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container px-4 py-6">
			<h1 className="text-2xl font-bold mb-4">Prévisualisation</h1>
		</div>
	);
}
