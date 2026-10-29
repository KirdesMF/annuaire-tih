import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import * as v from "valibot";
import { companiesByCategoryQuery } from "~/lib/api/companies/queries/get-companies-by-category";
import { CategorySearchSchema } from "~/lib/validator/category.schema";

export const Route = createFileRoute("/(public)/categories/$slug")({
  validateSearch: (search) => v.parse(CategorySearchSchema, search),
  loaderDeps: ({ search }) => ({
    categoryId: search.id,
  }),
  loader: async ({ context, deps: { categoryId } }) => {
    await context.queryClient.ensureQueryData(
      companiesByCategoryQuery({ categoryId, status: "active" }),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id, name } = Route.useSearch();
  const router = useRouter();
  const { data } = useSuspenseQuery(companiesByCategoryQuery({ categoryId: id, status: "active" }));

  return (
    <main className="min-h-svh">
      <div className="max-w-5xl mx-auto px-4 py-16 grid gap-6">
        <header className="space-y-2">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="text-sm text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-primary transition-colors duration-300"
          >
            <ArrowLeftIcon className="size-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold first-letter:capitalize">{name}</h1>
        </header>

        {data.companies.length === 0 ? (
          <div>Aucune entreprise trouvée</div>
        ) : (
          <ul className="grid gap-2">
            {data.companies.map((company) => (
              <li key={company.id}>
                <Link
                  to="/entreprises/$slug"
                  params={{ slug: company.slug }}
                  className="flex items-center justify-between gap-2 border border-border bg-card text-card-foreground rounded-md p-4 shadow-xs focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>{company.name}</span>

                  {company.subdomain && (
                    <span className="text-xs text-muted-foreground border-muted border rounded-md px-2 py-1">
                      {company.subdomain}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
