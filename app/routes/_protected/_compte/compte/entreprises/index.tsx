import { queryOptions, useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { unknown } from "better-auth";
import { eq, inArray } from "drizzle-orm";
import { useState } from "react";
import { toast } from "sonner";
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
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { auth } from "~/lib/auth";

export const getUserCompanies = createServerFn({ method: "GET" }).handler(async () => {
	const request = getWebRequest();
	if (!request) return;

	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) throw redirect({ to: "/login" });

	// Get companies
	const companiesQuery = await db
		.select({
			id: companiesTable.id,
			name: companiesTable.name,
			description: companiesTable.description,
			status: companiesTable.status,
			siret: companiesTable.siret,
		})
		.from(companiesTable)
		.where(eq(companiesTable.user_id, session.user.id));

	// Then get categories in a separate query
	const categories = await db
		.select({
			company_id: companyCategoriesTable.company_id,
			category_id: categoriesTable.id,
			category_name: categoriesTable.name,
		})
		.from(companyCategoriesTable)
		.leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
		.where(
			inArray(
				companyCategoriesTable.company_id,
				companiesQuery.map((c) => c.id),
			),
		);

	return companiesQuery.map((company) => ({
		...company,
		categories: categories.filter((c) => c.company_id === company.id),
	}));
});

export const deleteCompany = createServerFn({ method: "POST" })
	.validator((data: string) => data as string)
	.handler(async ({ data }) => {
		try {
			await db.delete(companiesTable).where(eq(companiesTable.id, data));
		} catch (error) {
			console.error(error);
		}
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
	const companiesQuery = useSuspenseQuery(userCompaniesQueryOptions);
	const context = Route.useRouteContext();
	const { mutate, isPending } = useMutation({ mutationFn: deleteCompany });
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	function onDeleteCompany(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		mutate(
			{ data: formData.get("companyId") as string },
			{
				onSuccess: () => {
					context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					setIsDialogOpen(false);
					toast.success("Entreprise supprimée avec succès");
				},
				onError: () => {
					toast.error("Une erreur est survenue lors de la suppression de l'entreprise");
				},
			},
		);
	}

	if (!companiesQuery.data?.length) {
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
				{companiesQuery.data?.map((company) => (
					<li key={company.id}>
						<article className="border border-gray-300 p-5 rounded-sm relative">
							<header className="flex items-baseline mb-4 gap-2">
								<h2 className="text-lg font-bold leading-1 ">{company.name}</h2>
								<p className="text-xs text-orange-300">{company.status}</p>
							</header>

							<button
								type="button"
								className="text-xs text-gray-500 border px-2 py-1 rounded-sm inline-flex gap-2 items-center hover:cursor-pointer absolute top-3 end-4"
							>
								{company.siret}
								<CopyIcon className="size-4" />
							</button>

							<p className="text-xs text-gray-500 mb-4">{company.description}</p>

							<ul className="flex flex-wrap gap-2 mb-4">
								{company.categories.map((category) => (
									<li
										key={category.category_id}
										className="bg-gray-100 px-2 py-1 rounded-sm text-xs flex items-center gap-2"
									>
										{category.category_name}
									</li>
								))}
							</ul>

							<footer className="flex gap-2">
								<Link
									to="/compte/entreprises/$entrepriseId/edit"
									params={{ entrepriseId: company.id }}
									className="text-xs px-2 py-1 rounded-sm border border-blue-400 text-blue-400"
								>
									Modifier
								</Link>

								<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

											<form onSubmit={onDeleteCompany}>
												<input type="hidden" name="companyId" value={company.id} />
												<button
													type="submit"
													className="text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
												>
													{isPending ? "..." : "Valider"}
												</button>
											</form>
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
