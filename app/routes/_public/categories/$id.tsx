import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/categories/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const categoryId = Route.useParams().id;

	return (
		<div>
			<h1>Hello {categoryId}!</h1>
			<Link to="/categories">Back to categories</Link>
		</div>
	);
}
