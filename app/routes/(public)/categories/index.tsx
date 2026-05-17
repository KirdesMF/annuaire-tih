import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Rows3 } from "lucide-react";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { seo } from "~/lib/seo";
import { categoryIcons } from "~/utils/category-icons";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/(public)/categories/")({
  head: () =>
    seo({
      title: "Toutes les catégories",
      description:
        "Parcourez toutes les catégories de l'annuaire TIH pour trouver des prestataires indépendants handicapés.",
      path: "/categories",
    }),
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions);
  },
});

function RouteComponent() {
  const { data: categories } = useSuspenseQuery({
    ...categoriesQueryOptions,
    select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-10 lg:px-20">
        <div className="mb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Accueil
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Toutes les catégories
        </h1>
        <p className="mt-2 text-muted-foreground">{categories.length} catégories référencées</p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] ?? Rows3;

            return (
              <li key={category.id}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: slugify(category.name) }}
                  search={{ id: category.id, name: category.name }}
                  className="flex items-center gap-4 rounded-xs border border-border bg-card p-5 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xs bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
