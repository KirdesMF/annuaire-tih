// app/routes/index.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FunnelIcon } from "lucide-react";
import abtraining from "~/assets/img/ab-training.png?url";
import edmMobile from "~/assets/img/edm-mobile.webp?url";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { seo } from "~/lib/seo";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/")({
  head: () => seo(),
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions);
  },
});

function Home() {
  const { data: categories } = useSuspenseQuery({
    ...categoriesQueryOptions,
    select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-10 lg:px-20">
        <div className="grid gap-12 md:grid-cols-2">
          <p className="text-2xl md:text-3xl lg:text-4xl">
            Collaborez directement avec des entrepreneurs·ses bénéficiant du statut de *Travailleur
            Indépendant Handicapé (TIH) grâce à cet annuaire spécialisé gratuit et public.
          </p>
          <div />
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-20">
          <a
            href="#categories"
            className="inline-flex h-14 min-w-64 items-center justify-center bg-primary px-8 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Rechercher un prestataire
          </a>

          <Link
            to="/sign-up"
            className="inline-flex h-14 min-w-64 items-center justify-center bg-secondary px-8 text-sm font-medium text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Référencer mon entreprise
          </Link>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-4xl px-6 pb-32 pt-6 text-center">
        <FunnelIcon className="mx-auto mb-4 size-20 fill-foreground stroke-foreground" />
        <h2 className="text-2xl font-extrabold tracking-tight">Rechercher par catégorie</h2>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to="/categories/$slug"
                params={{ slug: slugify(category.name) }}
                search={{ id: category.id, name: category.name }}
                className="flex min-h-11 items-center justify-center bg-secondary px-4 py-2 text-sm text-secondary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted px-6 py-14 text-center">
        <h2 className="text-2xl font-light">Sponsors</h2>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-20 sm:flex-row">
          <a href="https://www.en-dautres-mots.fr" target="_blank" rel="noreferrer noopener">
            <img
              src={edmMobile}
              alt="En d'autres mots, accompagnement administratif"
              className="h-80 w-56 object-cover"
            />
          </a>

          <a href="https://www.abtraining.fr" target="_blank" rel="noreferrer noopener">
            <img src={abtraining} alt="AB Training" className="h-80 w-72 bg-card object-contain" />
          </a>
        </div>
      </section>
    </main>
  );
}
