// app/routes/index.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Rows3, SearchIcon } from "lucide-react";
import { useState } from "react";
import abtraining from "~/assets/img/ab-training.png?url";
import edmMobile from "~/assets/img/edm-mobile.webp?url";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { seo } from "~/lib/seo";
import { categoryIcons } from "~/utils/category-icons";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/")({
  head: () => seo(),
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions);
  },
});

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: categories } = useSuspenseQuery({
    ...categoriesQueryOptions,
    select: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const category = categories.find((c) => c.id === selectedCategory);
    navigate({
      to: "/search",
      search: {
        q: searchTerm,
        categoryId: selectedCategory,
        categoryName: category?.name ?? "",
      },
    });
  }

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl bg-background/50 px-4 py-24 md:px-10 lg:px-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-2xl md:text-3xl lg:text-4xl">
              Collaborez directement avec des entrepreneurs·ses bénéficiant du statut de *Travailleur
              Indépendant Handicapé (TIH) grâce à cet annuaire spécialisé gratuit et public.
            </p>
          </div>

          <div />
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-12 w-full rounded-xs border border-border bg-card text-card-foreground p-6 md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_1fr_auto]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search">Mot-clé</Label>
              <div className="relative">
                <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nom, activité…"
                  className="h-12 ps-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value ?? "")}
              >
                <SelectTrigger
                  id="category"
                  className="h-12 w-full"
                >
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex h-12 min-w-32 items-center justify-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <SearchIcon className="size-4" />
                Rechercher
              </button>
            </div>
          </div>
        </form>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 pb-32 pt-16 md:px-10 lg:px-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight">Rechercher par catégorie</h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("categories-scroll");
                if (el) el.scrollBy({ left: -300, behavior: "smooth" });
              }}
              className="flex size-10 items-center justify-center rounded-xs border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("categories-scroll");
                if (el) el.scrollBy({ left: 300, behavior: "smooth" });
              }}
              className="flex size-10 items-center justify-center rounded-xs border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="size-5" />
            </button>

            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Tout voir
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div
          id="categories-scroll"
          className="scrollbar-none flex gap-4 overflow-x-auto"
        >
          {categories.slice(0, 6).map((category) => {
            const Icon = categoryIcons[category.name] ?? Rows3;

            return (
              <Link
                key={category.id}
                to="/categories/$slug"
                params={{ slug: slugify(category.name) }}
                search={{ id: category.id, name: category.name }}
                className="flex h-36 w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-xs border border-border bg-card p-5 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex size-12 items-center justify-center rounded-xs bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <span className="text-center text-sm font-medium">{category.name}</span>
              </Link>
            );
          })}

          <Link
            to="/categories"
            className="flex h-36 w-44 shrink-0 flex-col items-center justify-center gap-2 rounded-xs border border-dashed border-border bg-card/50 p-5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Rows3 className="size-6" />
            <span className="text-center text-sm font-medium">
              Voir toutes les catégories
            </span>
          </Link>
        </div>
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
