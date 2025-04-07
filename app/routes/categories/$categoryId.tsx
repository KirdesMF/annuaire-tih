import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$categoryId")({
	component: RouteComponent,
});

function RouteComponent() {
	const categoryId = Route.useParams().categoryId;

	return (
		<div>
			<h1>Hello {categoryId}!</h1>
			<Link to="/categories">Back to categories</Link>
		</div>
	);
}
