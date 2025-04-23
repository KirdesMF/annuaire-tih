import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/partner")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/partenariats"!</div>;
}
