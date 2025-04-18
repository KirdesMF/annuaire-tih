import { createFileRoute, Link } from "@tanstack/react-router";
import * as v from "valibot";

const SearchSchema = v.object({
	id: v.string(),
});

export const Route = createFileRoute("/_public/categories/$slug")({
	validateSearch: (search) => v.parse(SearchSchema, search),
	component: RouteComponent,
});

function RouteComponent() {
	const slug = Route.useParams().slug;
	const { id } = Route.useSearch();

	return (
		<main>
			<div className="container px-4 py-16">
				<header>
					<Link to="/" className="text-sm text-gray-500">
						Back
					</Link>
					<h1 className="text-2xl font-bold">{slug}</h1>
					<p className="text-sm text-gray-500">{id}</p>
				</header>
			</div>
		</main>
	);
}
