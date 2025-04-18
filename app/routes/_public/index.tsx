// app/routes/index.tsx
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import banner from "~/assets/img/banner.png?url";
import { InputSearch } from "~/components/input-search";
import { useDebounce } from "~/hooks/use-debounce";
import { categoriesQueryOptions } from "~/lib/api/categories";
import { setSearchCompaniesByTermQueryOptions } from "~/lib/api/search";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/_public/")({
	component: Home,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(categoriesQueryOptions);
	},
});

function Home() {
	const categoriesQuery = useSuspenseQuery(categoriesQueryOptions);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);
	const { data: companies } = useQuery(setSearchCompaniesByTermQueryOptions(debouncedSearchTerm));

	return (
		<main className="px-4 py-6 max-w-4xl mx-auto">
			<div className="mt-12 grid place-items-center relative h-60 border border-gray-400 rounded-md ">
				<div className="absolute inset-0 bg-diagonal-lines" />
				<img
					aria-hidden
					src={banner}
					alt="banner"
					className="w-full h-full object-contain absolute inset-0"
				/>
			</div>

			<div className="mt-12 mx-auto flex flex-col gap-4 items-center w-[min(100%,500px)]">
				<InputSearch value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
				{companies?.length && searchTerm ? (
					<ul className="flex flex-col gap-4 w-full border border-gray-400 rounded-sm">
						{companies?.map((company) => (
							<li key={company.id} className="w-full">
								<Link
									to="/entreprises/$slug"
									params={{ slug: company.slug }}
									className="px-4 py-2 w-full inline-flex hover:bg-gray-100"
								>
									{company.name}
								</Link>
							</li>
						))}
					</ul>
				) : (
					searchTerm && <p className="text-sm font-light">Aucune entreprise trouvée</p>
				)}
			</div>

			<div role="separator" tabIndex={-1} className="h-px w-1/3 bg-gray-400 my-12 mx-auto" />

			<ul className="flex flex-wrap justify-center gap-2 mt-12 max-w-3xl mx-auto">
				{categoriesQuery.data.map((category) => (
					<li key={category.id}>
						<Link
							to="/categories/$slug"
							params={{ slug: slugify(category.name) }}
							search={{ id: category.id }}
							className="text-sm px-4 py-2 border border-gray-400 rounded-md flex"
						>
							{category.name}
						</Link>
					</li>
				))}
			</ul>

			<div className="flex flex-col gap-4 mt-12 max-w-3xl mx-auto">
				<article className="p-4 flex flex-col gap-3">
					<h2>D'entreprise à TIH, de gagnant à gagnant !</h2>
					<p className="text-sm font-light">
						Élargissez votre vivier de talents en découvrant des profils d'entrepreneurs·ses
						expert·e·s dans leur domaine et doté·e·s d'une grande force d'adaptation. Renforcez
						votre politique inclusive et bénéficiez de réductions sur votre contribution OETH en
						sous-traitant avec des TIH !
					</p>
				</article>

				<article className="p-4 flex flex-col gap-3">
					<h2>De nombreux services proposés aux particuliers !</h2>
					<p className="text-sm font-light">
						Faites appel à un·e professionnel·le pour vous accompagner ou réaliser vos tâches, de
						façon ponctuelle ou pour des missions plus longues. Profitez de services sur mesure et
						découvrez les nombreux domaines couverts par les TIH.
					</p>
				</article>
			</div>
		</main>
	);
}
