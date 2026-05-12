import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchXIcon } from "lucide-react";
import * as v from "valibot";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { companiesByCategoryQuery } from "~/lib/api/companies/queries/get-companies-by-category";
import { seo } from "~/lib/seo";
import { slugify } from "~/utils/slug";

const SearchSchema = v.object({
  q: v.optional(v.string(), ""),
  categoryId: v.optional(v.string(), ""),
  categoryName: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/(public)/search")({
  validateSearch: (search) => v.parse(SearchSchema, search),
  head: () =>
    seo({
      title: "Résultats de recherche",
      description: "Résultats de recherche sur l'annuaire TIH.",
      path: "/search",
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { q, categoryId, categoryName } = Route.useSearch();

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-10 lg:px-20">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          Résultats de recherche
        </h1>

        {q ? (
          <p className="text-lg text-muted-foreground">
            Recherche pour : <span className="font-medium text-foreground">{q}</span>
          </p>
        ) : null}

        {categoryName ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Catégorie : <span className="font-medium text-foreground">{categoryName}</span>
          </p>
        ) : null}

        {categoryId ? (
          <SearchResults categoryId={categoryId} />
        ) : (
          <div className="mt-16">
            <Empty>
              <EmptyMedia variant="icon">
                <SearchXIcon />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Affinez votre recherche</EmptyTitle>
                <EmptyDescription>
                  Sélectionnez une catégorie ou saisissez un mot-clé pour trouver des prestataires.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center bg-secondary px-6 text-sm font-medium text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}

function SearchResults({ categoryId }: { categoryId: string }) {
  const { data } = useSuspenseQuery(
    companiesByCategoryQuery({ categoryId, status: "active" }),
  );

  if (data.companies.length === 0) {
    return (
      <div className="mt-16">
        <Empty>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Aucune entreprise trouvée</EmptyTitle>
            <EmptyDescription>
              Aucune entreprise active ne correspond à cette catégorie.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <p className="mb-6 text-sm text-muted-foreground">
        {data.companies.length} entreprise{data.companies.length > 1 ? "s" : ""} trouvée
        {data.companies.length > 1 ? "s" : ""}
      </p>

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
    </div>
  );
}
