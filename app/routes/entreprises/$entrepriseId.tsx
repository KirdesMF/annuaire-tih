import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/entreprises/$entrepriseId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/entreprises/$entrepriseId"!</div>;
}
