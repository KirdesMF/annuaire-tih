import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/categories/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<h1>Categories</h1>
		</div>
	);
}
