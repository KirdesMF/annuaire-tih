import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/$id/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	return <div>Hello "/_protected/compte/entreprises/{id}/edit"!</div>;
}
