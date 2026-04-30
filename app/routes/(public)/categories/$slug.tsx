import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchXIcon } from "lucide-react";
import * as v from "valibot";
import banner from "~/assets/img/banniere.png?url";
import logo from "~/assets/img/Logo vecto_png.png?url";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { companiesByCategoryQuery } from "~/lib/api/companies/queries/get-companies-by-category";

const SearchSchema = v.object({
  id: v.string(),
  name: v.string(),
});

export const Route = createFileRoute("/(public)/categories/$slug")({
  validateSearch: (search) => v.parse(SearchSchema, search),
  loaderDeps: ({ search }) => ({
    categoryId: search.id,
  }),
  loader: async ({ context, deps }) => {
    const { categoryId } = deps;
    await context.queryClient.ensureQueryData(
      companiesByCategoryQuery({ categoryId, status: "active" }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id, name } = Route.useSearch();
  const { data } = useSuspenseQuery(companiesByCategoryQuery({ categoryId: id, status: "active" }));

  return (
    <main className="bg-background text-foreground">
      <section className="pt-16 text-center md:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-10 md:pb-12">
          <img src={logo} alt="Annuaire TIH" className="mb-8 h-32 w-auto md:h-44" />
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Annuaire - TIH</h1>
          <p className="mt-5 text-2xl font-light md:text-4xl">
            Votre réseau de prestataires indépendants TIH*.
          </p>
        </div>

        <img
          src={banner}
          alt="Illustration Annuaire TIH"
          className="h-40 w-full object-cover object-center md:h-72"
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <h1 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
          {name}
        </h1>

        {data.companies.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Aucune entreprise trouvée</EmptyTitle>
              <EmptyDescription>
                Aucune entreprise active ne correspond encore à cette catégorie.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="space-y-2">
            {data.companies.map((company) => (
              <li key={company.id}>
                <Link
                  to="/entreprises/$slug"
                  params={{ slug: company.slug }}
                  className="flex min-h-14 items-center justify-between gap-4 bg-secondary px-4 py-3 text-sm text-secondary-foreground transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span>{company.name}</span>
                  {company.subdomain && <span className="text-xs">{company.subdomain}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
