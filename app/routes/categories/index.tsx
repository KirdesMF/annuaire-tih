import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

function getAllCategories() {
	return [
		{ id: 1, name: "Category 1" },
		{ id: 2, name: "Category 2" },
		{ id: 3, name: "Category 3" },
	];
}

const getCategories = createServerFn({
	method: "GET",
}).handler(() => {
	return getAllCategories();
});

export const Route = createFileRoute("/categories/")({
	component: RouteComponent,
	loader: () => getCategories(),
});

function RouteComponent() {
	const categories = Route.useLoaderData();

	return (
		<div>
			{categories.map((category) => (
				<div key={category.id}>
					<Link
						to="/categories/$categoryId"
						params={{ categoryId: category.id.toString() }}
					>
						{category.name}
					</Link>
				</div>
			))}
		</div>
	);
}
