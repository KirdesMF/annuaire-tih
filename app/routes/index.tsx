// app/routes/index.tsx
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Separator } from "radix-ui";
import { useState } from "react";
import banner from "~/assets/img/banner.png?url";
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
  const categoriesQuery = useSuspenseQuery(categoriesQueryOptions);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data: companies, isFetching } = useQuery(companiesByTermQuery(debouncedSearchTerm));

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mt-12 grid place-items-center relative h-60 border border-gray-400 rounded-md ">
        <div className="absolute inset-0 bg-diagonal-lines" />
        <img
          aria-hidden
          src={banner}
          alt="banner"
          className="w-full h-full object-contain absolute inset-0"
        />
      </div>

      <div className="mt-12 mx-auto flex flex-col gap-4 items-center w-[min(100%,500px)]">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="text-start text-nowrap truncate text-sm font-light px-4 border border-gray-400 rounded-md shadow-sm w-full h-12 focus-within:outline focus-within:outline-blue-500 cursor-pointer"
            >
              Rechercher un nom ou une activité...
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
                  <CommandItem key={company.id} asChild>
                    <Link to="/entreprises/$slug" params={{ slug: company.slug }}>
                      {company.name}
                    </Link>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Separator.Root className="h-px w-1/3 bg-gray-400 my-12 mx-auto" />

      <ul className="flex flex-wrap justify-center gap-2 mt-12 max-w-3xl mx-auto">
        {categoriesQuery.data.map((category) => (
          <li key={category.id}>
            <Link
              to="/categories/$slug"
              params={{ slug: slugify(category.name) }}
              search={{ id: category.id }}
              className="text-sm px-4 py-1.5 border border-gray-400 rounded-md flex text-nowrap"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
