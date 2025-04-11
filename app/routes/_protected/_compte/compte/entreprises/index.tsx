import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { CopyIcon } from "~/components/icons/copy";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { auth } from "~/lib/auth";

export const getUserCompanies = createServerFn({ method: "GET" }).handler(async () => {
	const request = getWebRequest();
	if (!request) return;

	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) throw redirect({ to: "/login" });

	const companies = await db
		.select()
		.from(companiesTable)
		.where(eq(companiesTable.user_id, session.user.id));
	return companies;
});

const userCompaniesQueryOptions = queryOptions({
	queryKey: ["user", "companies"],
	queryFn: () => getUserCompanies(),
});

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/")({
	loader: async ({ context }) => {
		const companies = context.queryClient.ensureQueryData(userCompaniesQueryOptions);
		return companies;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();

	if (!data?.length) {
		return (
			<div className="container px-4 py-6">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-2xl font-bold">Vous n'avez encore d'entreprise référencée</h1>
					<Link to="/compte/entreprises/add" className="text-sm border px-2 py-1 rounded-sm">
						Créer une entreprise
					</Link>
				</div>
			</div>
		);
	}
	return (
		<div className="container px-4 py-6">
			<header className="mb-6">
				<h1 className="text-2xl font-bold">Mes entreprises</h1>
				<p>Gérez vos entreprises et leurs informations.</p>
			</header>

			<ul className="flex flex-col gap-2">
				{data?.map((company) => (
					<li key={company.id}>
						<article className="border border-gray-300 p-5 rounded-sm relative">
							<header className="flex items-baseline mb-2 gap-2">
								<h2 className="text-lg font-bold leading-1 ">{company.name}</h2>
								<p className="text-xs text-orange-300">{company.status}</p>
							</header>

							<button
								type="button"
								className="text-sm text-gray-500 border px-2 py-1 rounded-sm inline-flex gap-2 items-center hover:cursor-pointer absolute top-3 end-4"
							>
								{company.siret}
								<CopyIcon className="size-4" />
							</button>

							<footer className="flex gap-2">
								<Link
									to="/compte/entreprises/$entrepriseId/edit"
									params={{ entrepriseId: company.id }}
									className="text-xs px-2 py-1 rounded-sm border border-blue-400 text-blue-400"
								>
									Modifier
								</Link>

								<Dialog>
									<DialogTrigger asChild>
										<button
											type="button"
											className="text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
										>
											Supprimer
										</button>
									</DialogTrigger>

									<DialogContent className="grid gap-4">
										<DialogTitle className="text-lg font-bold">
											Supprimer une entreprise
										</DialogTitle>

										<div className="space-y-2">
											<DialogDescription className="text-sm text-gray-500">
												Valider la suppression de l'entreprise <strong>{company.name}</strong> ?
											</DialogDescription>

											<p className="text-sm text-gray-500">
												Cette action est irréversible. Toutes les données liées à cette entreprise
												seront perdues.
											</p>
										</div>

										<div className="grid grid-flow-col gap-2 place-content-end">
											<DialogClose asChild>
												<button
													type="button"
													className="text-xs px-2 py-1 rounded-sm border border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-colors"
												>
													Annuler
												</button>
											</DialogClose>

											<button
												type="button"
												className="text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
											>
												Valider
											</button>
										</div>
									</DialogContent>
								</Dialog>
							</footer>
						</article>
					</li>
				))}
			</ul>
		</div>
	);
}
