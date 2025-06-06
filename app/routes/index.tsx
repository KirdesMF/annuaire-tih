// app/routes/index.tsx
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BookUser,
  FunnelIcon,
  GlobeIcon,
  HandshakeIcon,
  MailIcon,
  MoveRightIcon,
  PhoneIcon,
  ScanSearchIcon,
  SearchIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Separator } from "radix-ui";
import { useState } from "react";
import abtraining from "~/assets/img/ab-training.png?url";
import banner from "~/assets/img/banner.webp?url";
import edmDesktop from "~/assets/img/edm-desktop.webp?url";
import edmMobile from "~/assets/img/edm-mobile.webp?url";
import malette from "~/assets/img/malette.webp?url";

import { LinkedinIcon } from "~/components/icons/linkedin";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useDebounce } from "~/hooks/use-debounce";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { companiesByTermQuery } from "~/lib/api/companies/queries/get-companies-by-term";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/")({
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
  const navigate = Route.useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data: companies, isFetching } = useQuery(companiesByTermQuery(debouncedSearchTerm));

  function onNavigate(path: string, slug: string) {
    navigate({ to: path, params: { slug } });
  }

  return (
    <main className="px-4 md:px-16 py-20">
      <div className="max-w-4xl mx-auto h-64 border border-border rounded-sm overflow-hidden">
        <img
          src={banner}
          alt="Annuaire TIH"
          className="size-full object-cover md:object-contain grayscale-30 hover:grayscale-0 transition-all duration-300"
        />
      </div>

      <section className="flex flex-col gap-4 items-center py-20 max-w-xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="text-xs text-secondary-foreground bg-secondary w-fit px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-border">
            <BookUser className="size-4" />
            <span>Annuaire public et gratuit</span>
          </div>
          <h1 className="text-5xl font-bold text-pretty tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground from-10% via-foreground/90 via-30% to-foreground/60 to-80%">
            Votre réseau de prestataires indépendants <span className="text-primary">TIH*</span>.
          </h1>

          <p className="text-muted-foreground text-pretty text-lg leading-relaxed">
            Collaborez directement avec des entrepreneurs·es bénéficiant du statut de *
            <span className="font-bold underline underline-offset-2">
              Travailleur Indépendant Handicapé (TIH)
            </span>{" "}
            grâce à cet annuaire spécialisé gratuit et public.
          </p>

          <div className="flex gap-4">
            <Link
              to="/sign-up"
              className="text-xs px-4 py-2 bg-primary/75 ring-1 ring-primary/90 text-primary-foreground shadow-md rounded-sm flex items-center gap-2 text-nowrap focus:outline-primary focus:outline-2"
            >
              Référencer mon entreprise
            </Link>

            <a
              href="#search"
              className="text-xs px-4 py-2 ring-1 ring-border shadow-md rounded-sm flex items-center gap-2 text-nowrap focus:outline-primary focus:outline-2"
            >
              Rechercher un prestataire
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 relative" id="search">
        <div className="absolute top-20 start-0 hidden xl:grid w-2/9">
          <a
            href="https://www.en-dautres-mots.fr"
            target="_blank"
            rel="noreferrer noopener"
            className="w-full"
          >
            <img src={edmDesktop} alt="" className="w-full object-cover" />
          </a>
        </div>

        <div className="flex flex-col gap-8 items-center max-w-3xl mx-auto">
          <div className="flex flex-col gap-4 items-center">
            <div className="text-xs text-secondary-foreground bg-secondary w-fit px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-border">
              <ScanSearchIcon className="size-4" />
              <span>Recherche rapide</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-center tracking-tight">
                Rechercher un prestataire
              </h2>
              <p className="text-muted-foreground text-center text-md font-light leading-relaxed">
                Entrez un nom, une activité ou un mot clé pour trouver un prestataire TIH.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center max-w-lg w-full">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-between text-start text-nowrap truncate text-sm font-light px-4 ring-1 ring-input/50 shadow-2xs rounded-sm w-full h-12 focus:outline-2 focus:outline-primary cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <SearchIcon className="size-4 text-muted-foreground font-thin" />
                    <span>Taper votre recherche...</span>
                  </span>
                  <kbd className="text-xs px-1.5 py-0.5 rounded-sm bg-muted pointer-events-none hidden lg:flex gap-1 font-mono">
                    <span>⌘</span>
                    <span>K</span>
                  </kbd>
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <Command shouldFilter={false} className="py-2">
                  <CommandInput
                    value={searchTerm}
                    onValueChange={(value) => setSearchTerm(value)}
                    placeholder="Entrez un nom ou une activité..."
                  />
                  <CommandSeparator alwaysRender />
                  <CommandList>
                    {!searchTerm && <CommandEmpty>Entrez au moins 3 caractères...</CommandEmpty>}
                    {searchTerm && isFetching && <CommandLoading>Loading...</CommandLoading>}
                    {searchTerm.length >= 3 && !isFetching && (
                      <CommandEmpty>Aucune entreprise trouvée</CommandEmpty>
                    )}
                    {companies?.map((company) => (
                      <CommandItem
                        key={company.id}
                        onSelect={() => onNavigate("/entreprises/$slug", company.slug)}
                      >
                        {company.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      <HomeSeparator />

      <section className="max-w-3xl py-20 mx-auto ">
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="text-xs text-secondary-foreground bg-secondary w-fit px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-border">
              <FunnelIcon className="size-4" />
              <span>Filtrer par catégorie</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-center tracking-tight">
                Rechercher par catégorie
              </h2>
              <p className="text-muted-foreground text-center text-md font-light leading-relaxed">
                Affinez votre recherche en sélectionnant une catégorie.
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap justify-center gap-2 ">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: slugify(category.name) }}
                  search={{ id: category.id, name: category.name }}
                  className="text-sm px-4 py-1.5 bg-accent text-accent-foreground rounded-sm flex text-nowrap outline-none focus:ring-primary focus:ring-2"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeSeparator />

      <section className="py-20 max-w-3xl mx-auto xl:hidden ">
        <div className="flex flex-col gap-4 items-center">
          <div className="text-xs text-secondary-foreground bg-secondary w-fit px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-border">
            <HandshakeIcon className="size-4" />
            <span>Sponsors</span>
          </div>
          <a href="https://www.en-dautres-mots.fr" target="_blank" rel="noreferrer noopener">
            <img src={edmMobile} alt="" className="size-full object-fit" />
          </a>
        </div>
      </section>

      <HomeSeparator />

      <section className="max-w-7xl mx-auto py-20 relative">
        <div className="grid gap-4 max-w-3xl mx-auto">
          <article className="ring-1 ring-border rounded-sm p-4 shadow grid gap-4 bg-card text-card-foreground w-full">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold tracking-tighter mb-2">Qui sommes nous ?</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">ANNUAIRE TIH</span> est un annuaire national référençant
                des entrepreneurs·ses ou des dirigeant·e·s de société qui disposent d'une
                reconnaissance de handicap.
              </p>
              <p className="text-sm text-muted-foreground">
                Notre mission est de promouvoir les freelances/travailleurs·ses indépendant·e·s en
                situation de handicap en France et DROM-COM.
              </p>
            </div>

            <Link
              to="/about"
              className=" w-fit text-xs px-4 py-2 bg-primary/75 ring-1 ring-primary/90 text-primary-foreground shadow-md rounded-sm flex items-center gap-2 text-nowrap focus:outline-primary focus:outline-2"
            >
              En savoir plus
              <MoveRightIcon className="size-3" />
            </Link>
          </article>

          <div className="flex gap-4 flex-col sm:flex-row">
            <article className="flex-1 ring-1 ring-border rounded-sm p-4 shadow w-fit flex flex-col gap-4 bg-card text-card-foreground">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold tracking-tighter">
                  Vous êtes entrepreneur en situation de handicap ?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Référencez votre entreprise gratuitement en créant votre compte. Vous pouvez
                  référencer jusqu'à 3 entreprises.
                </p>
              </div>
              <Link
                to="/sign-up"
                className="w-fit text-xs px-4 py-2 bg-primary/75 ring-1 ring-primary/90 text-primary-foreground shadow-md rounded-sm flex items-center gap-2 text-nowrap focus:outline-primary focus:outline-2"
              >
                Créer un compte
                <MoveRightIcon className="size-3" />
              </Link>
            </article>

            <article className="flex-1 ring-1 ring-border rounded-sm p-4 shadow w-fit flex flex-col gap-4 bg-card text-card-foreground overflow-clip relative group">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold tracking-tighter">Où nous retrouver.</h3>
                <p className="text-sm text-muted-foreground">
                  Pour plus d'informations ou pour suivre nos activités, rejoignez nous sur{" "}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://www.linkedin.com/groups/13011531/"
                    className="text-blue-500 border-b border-blue-500 w-max inline-flex items-center gap-1"
                  >
                    <span>notre groupe Linkedin</span>
                    <SquareArrowOutUpRight className="size-3" />
                  </a>
                </p>
              </div>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://www.linkedin.com/groups/13011531/"
                className="mt-auto w-fit text-xs px-4 py-2 bg-primary/75 ring-1 ring-primary/90 text-primary-foreground shadow-md rounded-sm flex items-center gap-2 text-nowrap focus:outline-primary focus:outline-2"
              >
                Rejoignez nous
                <SquareArrowOutUpRight className="size-3" />
              </a>

              <LinkedinIcon className="size-32 absolute -bottom-6 -end-6 text-muted -rotate-30 group-hover:text-blue-500 transition-colors duration-300" />
              <img
                src={malette}
                alt="Malette du groupe Linkedin"
                className="absolute -bottom-12 end-10 h-28 group-hover:-translate-y-6 transition-transform duration-300 grayscale-50 group-hover:grayscale-0"
              />
            </article>
          </div>
        </div>
      </section>

      <HomeSeparator />

      <section className="max-w-3xl mx-auto py-20">
        <div className="flex flex-col gap-6 items-center">
          <div className="text-xs text-secondary-foreground bg-secondary w-fit px-4 py-2 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-border">
            <HandshakeIcon className="size-4" />
            <span>Sponsors</span>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border border-border rounded-sm text-black bg-[#66C9F9] shadow-sm font-luciole">
              <div className="flex gap-4">
                <div className="p-6 w-full sm:w-1/2 bg-white grid place-items-center rounded-s-sm">
                  <a href="https://www.abtraining.fr" target="_blank" rel="noreferrer noopener">
                    <img src={abtraining} alt="AB Training" className="aspect-auto w-full" />
                  </a>
                </div>
                <div className="hidden sm:grid gap-5 px-4 py-6 flex-1">
                  <div className="text-center">
                    <p className="text-lg font-bold tracking-tighter">Notre force:</p>
                    <p className="text-sm">cadrer, expliquer, traduire, motiver.</p>
                  </div>
                  <div className="text-center text-sm font-light">
                    <p className="tracking-tighter">Accompagnement Conseil et Formation</p>
                    <p>Administratif et Financier</p>
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <p className="text-sm font-bold">Nous joindre:</p>
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href="mailto:contact@abtraining.fr"
                        className="text-xs flex items-center gap-1"
                      >
                        <MailIcon className="size-3" />
                        contact@abtraining.fr
                      </a>
                      <Separator.Root orientation="vertical" className="h-4 w-px bg-black" />
                      <a
                        href="tel:+33683231449"
                        className="text-xs flex items-center gap-1 text-nowrap"
                      >
                        <PhoneIcon className="size-3" />
                        +33 6 83 23 14 49
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ">
                    <p className="text-sm font-bold text-center">Site web:</p>
                    <a
                      href="https://www.abtraining.fr"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-xs flex items-center gap-1 justify-center"
                    >
                      <GlobeIcon className="size-3" />
                      www.abtraining.fr
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeSeparator() {
  return <Separator.Root className="w-50 md:w-96 h-px bg-border mx-auto" />;
}
