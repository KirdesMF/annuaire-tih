import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import * as v from "valibot";
import { companiesByCategoryQuery } from "~/lib/api/companies/queries/get-companies-by-category";

const SearchSchema = v.object({
  id: v.string(),
});

export const Route = createFileRoute("/(public)/categories/$slug")({
  validateSearch: (search) => v.parse(SearchSchema, search),
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
  const slug = Route.useParams().slug;
  const { id } = Route.useSearch();
  const { data } = useSuspenseQuery(companiesByCategoryQuery({ categoryId: id, status: "active" }));

  return (
    <main className="min-h-svh">
      <div className="max-w-5xl mx-auto px-4 py-16 grid gap-6">
        <header className="space-y-2">
          <Link to="/" className="text-sm text-muted-foreground flex items-center gap-1">
            <ArrowLeftIcon className="size-4" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold first-letter:capitalize">{slug.replace(/-/g, " ")}</h1>
        </header>

        {data.companies.length === 0 ? (
          <div>Aucune entreprise trouvée</div>
        ) : (
          <ul className="grid gap-2">
            {data.companies.map((company) => (
              <li
                key={company.id}
                className="flex flex-col gap-2 border border-border bg-card text-card-foreground rounded-md p-4 shadow-xs"
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
