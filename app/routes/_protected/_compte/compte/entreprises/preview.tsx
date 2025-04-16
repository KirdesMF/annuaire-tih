import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/preview")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_protected/_compte/compte/entreprises/preview"!</div>;
}
