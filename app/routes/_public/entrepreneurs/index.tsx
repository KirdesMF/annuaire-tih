import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/entrepreneurs/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/entrepreneurs/"!</div>;
}
