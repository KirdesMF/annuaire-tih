import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { LoaderIcon, Plus } from "lucide-react";
import { Separator } from "radix-ui";
import { useState } from "react";
import { CompanyLogo } from "~/components/company-logo";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useToast } from "~/components/ui/toast";
import { deleteCompany } from "~/lib/api/companies/mutations/delete-company";
import { userCompaniesQuery } from "~/lib/api/users/queries/get-user-companies";
import { COMPANY_STATUSES } from "~/utils/constantes";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/_protected/compte/entreprises/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(userCompaniesQuery(context.user.id));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const companiesQuery = useSuspenseQuery(userCompaniesQuery(context.user.id));
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCompany,
    onSettled: () => {
      context.queryClient.invalidateQueries({ queryKey: ["user", "companies", context.user.id] });
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { toast } = useToast();

  function onDeleteCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    mutate(
      {
        data: {
          companyId: formData.get("companyId") as string,
          companySlug: formData.get("companySlug") as string,
        },
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            description: "Entreprise supprimée avec succès",
            button: { label: "Fermer" },
          });
        },
        onError: () => {
          toast({
            description: "Une erreur est survenue lors de la suppression de l'entreprise",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  if (!companiesQuery.data?.length) {
    return (
      <div className="container px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Vous n'avez encore d'entreprise référencée</h1>
          <Link
            to="/compte/entreprises/create"
            className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-sm"
          >
            Créer une entreprise
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tighter">Mes entreprises</h1>
        <p>Gérez vos entreprises et leurs informations.</p>
      </header>

      <ul className="flex flex-col gap-2 ">
        {companiesQuery.data?.map((company) => (
          <li key={company.id}>
            <article className="border border-border p-5 rounded-sm grid gap-4 shadow-2xs">
              <header className="flex items-baseline gap-2 justify-between">
                <div className="flex items-center gap-2">
                  {/* <CompanyLogo name={company.name} url={company.logo?.secureUrl} size="lg" /> */}
                  <h2 className="text-lg font-bold leading-1">{company.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {COMPANY_STATUSES[company.status]}
                  </p>
                </div>

                <p className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-sm inline-flex gap-2 items-center hover:cursor-pointer ">
                  {company.siret}
                </p>
              </header>

              <footer className="flex items-center gap-2 justify-between">
                <ul className="flex flex-wrap gap-2">
                  {company.categories.map((category) => (
                    <li
                      key={category.category_id}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs flex items-center gap-2"
                    >
                      <Link
                        to="/categories/$slug"
                        params={{ slug: slugify(category.category_name ?? "") }}
                        search={{ id: category.category_id ?? "" }}
                      >
                        {category.category_name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Link
                    to="/entreprises/$slug"
                    params={{ slug: company.slug }}
                    className="text-xs px-2 py-1 rounded-sm border border-secondary-foreground text-secondary-foreground"
                  >
                    Consulter
                  </Link>

                  <Link
                    to="/compte/entreprises/$slug/edit/infos"
                    params={{ slug: company.slug }}
                    className="text-xs px-2 py-1 rounded-sm border border-secondary-foreground text-secondary-foreground"
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
                        className="text-xs px-2 py-1 rounded-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => setCompanyId(company.id)}
                      >
                        Supprimer
                      </button>
                    </DialogTrigger>

                    <DialogContent className="grid gap-4 p-4">
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
                          <input type="hidden" name="companySlug" value={company.slug} />
                          <button
                            type="submit"
                            className="text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors"
                          >
                            {isPending ? <LoaderIcon className="size-4 animate-spin" /> : "Valider"}
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
        <div className="flex justify-end mt-4">
          <Link
            to="/compte/entreprises/create"
            className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-sm flex items-center gap-1 max-w-fit"
          >
            <Plus className="size-4" />
            Ajouter une entreprise
          </Link>
        </div>
      )}
    </div>
  );
}
