import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Separator } from "radix-ui";
import { useState } from "react";
import { toast } from "sonner";
import { CompanyLogo } from "~/components/company-logo";
import { CopyIcon } from "~/components/icons/copy";
import { PlusIcon } from "~/components/icons/plus";
import { StoreIcon } from "~/components/icons/store";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { Company, CompanyStatus } from "~/db/schema/companies";
import { deleteCompany } from "~/lib/api/companies";
import { userCompaniesQueryOptions } from "~/lib/api/user";
import { COMPANY_STATUSES } from "~/utils/constantes";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/")({
	loader: async ({ context }) => {
		const companies = await context.queryClient.ensureQueryData(userCompaniesQueryOptions);
		return companies;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const context = Route.useRouteContext();
	const companiesQuery = useSuspenseQuery(userCompaniesQueryOptions);
	const { mutate, isPending } = useMutation({ mutationFn: deleteCompany });
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [companyId, setCompanyId] = useState<string | null>(null);

	function onDeleteCompany(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		mutate(
			{ data: formData.get("companyId") as string },
			{
				onSuccess: () => {
					context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					context.queryClient.invalidateQueries({ queryKey: ["company", companyId] });

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

			<ul className="flex flex-col gap-2 ">
				{companiesQuery.data?.map((company) => (
					<li key={company.id}>
						<article className="border border-gray-300 p-5 rounded-sm grid gap-4 shadow-2xs">
							<header className="flex items-baseline gap-2 justify-between">
								<div className="flex items-center gap-2">
									<CompanyLogo company={company} />
									<h2 className="text-lg font-bold leading-1">{company.name}</h2>
									<p className="text-xs text-orange-300">{COMPANY_STATUSES[company.status]}</p>
								</div>

								<p className="text-xs text-gray-500 border px-2 py-1 rounded-sm inline-flex gap-2 items-center hover:cursor-pointer ">
									{company.siret}
								</p>
							</header>

							<footer className="flex items-center gap-2 justify-between">
								<ul className="flex flex-wrap gap-2">
									{company.categories.map((category) => (
										<li
											key={category.category_id}
											className="bg-gray-100 px-2 py-1 rounded-sm text-xs flex items-center gap-2"
										>
											{category.category_name}
										</li>
									))}
								</ul>
								<div className="flex gap-2">
									<Link
										to="/entreprises/$name"
										params={{ name: company.name.toLowerCase().replace(/ /g, "-") }}
										search={{ id: company.id }}
										className="text-xs px-2 py-1 rounded-sm border border-blue-400 text-blue-400"
									>
										Consulter
									</Link>

									<Link
										to="/compte/entreprises/$id/edit"
										params={{ id: company.id }}
										className="text-xs px-2 py-1 rounded-sm border border-blue-400 text-blue-400"
									>
										Modifier
									</Link>

									<Dialog
										open={isDialogOpen && companyId === company.id}
										onOpenChange={setIsDialogOpen}
									>
										<DialogTrigger asChild>
											<button
												type="button"
												className="text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
												onClick={() => setCompanyId(company.id)}
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
								</div>
							</footer>
						</article>
					</li>
				))}
			</ul>

			{companiesQuery.data.length < 3 && (
				<>
					<Separator.Root className="my-6 h-px bg-gray-300" />
					<CardCreateCompany />
				</>
			)}
		</div>
	);
}

function CardCreateCompany() {
	return (
		<article className="border border-gray-300 p-5 rounded-sm">
			<Link
				to="/compte/entreprises/add"
				className="text-sm border px-2 py-1 rounded-sm flex items-center gap-1.5 max-w-fit"
			>
				<PlusIcon className="size-4" />
				Créer une entreprise
			</Link>
		</article>
	);
}
