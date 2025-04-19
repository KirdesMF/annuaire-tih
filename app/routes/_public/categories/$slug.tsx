import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as v from "valibot";
import { SearchIcon } from "~/components/icons/search";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { setAllActiveCompaniesByCategoryQueryOptions } from "~/lib/api/companies";

const SearchSchema = v.object({
	id: v.string(),
});

export const Route = createFileRoute("/_public/categories/$slug")({
	validateSearch: (search) => v.parse(SearchSchema, search),
	loaderDeps: ({ search }) => ({
		categoryId: search.id,
	}),
	loader: async ({ context, deps: { categoryId } }) => {
		const companies = await context.queryClient.ensureQueryData(
			setAllActiveCompaniesByCategoryQueryOptions(categoryId),
		);

		return companies;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const slug = Route.useParams().slug;
	const { id } = Route.useSearch();
	const { data } = useSuspenseQuery(setAllActiveCompaniesByCategoryQueryOptions(id));

	return (
		<main>
			<div className="container px-4 py-16 grid gap-6">
				<header>
					<Link to="/" className="text-sm text-gray-500">
						Back
					</Link>
					<h1 className="text-2xl font-bold">{slug}</h1>
				</header>

				<div>
					<Label>
						<span className="sr-only">Rechercher une entreprise</span>

						<div className="flex items-center rounded-md border border-gray-200 px-2 focus-within:border-gray-500">
							<SearchIcon className="size-5" />
							<Input
								type="text"
								placeholder="Rechercher une entreprise"
								className="border-none outline-none"
							/>
						</div>
					</Label>
				</div>

				{data?.companies.length === 0 ? (
					<div>No companies found</div>
				) : (
					<ul>
						{data?.companies.map((company) => (
							<li
								key={company.id}
								className="flex flex-col gap-2 border border-gray-200 rounded-md p-4"
							>
								<Link to="/entreprises/$slug" params={{ slug: company.slug }}>
									{company.name}
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</main>
	);
}
