import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<h1>Categories</h1>
		</div>
	);
}
