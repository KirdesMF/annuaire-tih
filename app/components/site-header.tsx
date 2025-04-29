import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { User } from "better-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ColorSchemeIcon } from "~/components/icons/color-scheme";
import { MainNav } from "~/components/main-nav";
import { MenuUser } from "~/components/menu-user";
import { MobileNav } from "~/components/mobile-nav";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "~/components/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDebounce } from "~/hooks/use-debounce";
import { companiesByTermQuery } from "~/lib/api/companies/queries/get-companies-by-term";
import { colorSchemeQuery, setColorSchemeFn } from "~/lib/cookies/color-scheme.cookie";

export function SiteHeader({ user }: { user: User | undefined }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data: companies, isFetching } = useQuery(companiesByTermQuery(debouncedSearchTerm));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsDialogOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="px-4 md:px-8 py-3 border-b-[0.5px] border-gray-200 dark:border-gray-800 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="flex items-center gap-2 justify-between">
        <MainNav />
        <MobileNav />

        <div className="flex-1 md:flex-none flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full md:w-auto items-center gap-2 text-start text-xs text-nowrap font-light px-2.5 h-8 border border-gray-400 dark:border-gray-700 rounded-sm focus-within:outline focus-within:outline-blue-500"
              >
                <span className="hidden lg:block">Rechercher un nom ou une activité...</span>
                <span className="block lg:hidden">Rechercher...</span>
                <kbd className="text-xs px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800 pointer-events-none hidden lg:flex gap-1">
                  <span>⌘</span>
                  <span>K</span>
                </kbd>
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle className="sr-only">Rechercher une entreprise</DialogTitle>
              <Command shouldFilter={false} className="py-2">
                <CommandInput
                  value={searchTerm}
                  onValueChange={setSearchTerm}
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
            </DialogContent>
          </Dialog>

          {/* <a
            href="https://linkedin.com/groups/13011531"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
          >
            <LinkedinIcon className="size-5" />
          </a> */}

          <RegisterLink user={user} />
          <LoginButton user={user} />
          {user ? <MenuUser user={user} /> : <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}

function RegisterLink({ user }: { user: User | undefined }) {
  return (
    <Link
      to={user ? "/compte/entreprises/create" : "/sign-up"}
      className="text-xs px-2 py-1 h-8 items-center rounded-sm border border-gray-400 dark:border-gray-700 text-nowrap hidden md:inline-flex"
    >
      Se référencer
    </Link>
  );
}

function LoginButton({ user }: { user: User | undefined }) {
  if (user) return null;

  return (
    <Link
      to="/sign-in"
      className="text-xs px-2 py-1 h-8 hidden md:inline-flex items-center rounded-sm text-nowrap bg-blue-500 text-white"
    >
      Se connecter
    </Link>
  );
}

function ThemeToggle() {
  const queryClient = useQueryClient();
  const { data: colorScheme } = useQuery(colorSchemeQuery);

  const { mutate: setColorScheme } = useMutation({
    mutationFn: setColorSchemeFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["color-scheme"] }),
  });

  function onSelectColorScheme(scheme: "light" | "dark" | "system") {
    setColorScheme({ data: scheme }, { onSuccess: () => toast.success("Thème mis à jour") });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-xs px-2 py-1 h-8 inline-flex items-center rounded-sm border border-gray-400 dark:border-gray-700 text-nowrap cursor-pointer"
        >
          <ColorSchemeIcon className="size-4" />
          <span className="sr-only">Thème</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5} align="end">
        <DropdownMenuRadioGroup
          value={colorScheme}
          onValueChange={(value) => onSelectColorScheme(value as "light" | "dark" | "system")}
        >
          <DropdownMenuRadioItem value="light" className="flex items-center gap-2 px-2">
            <DropdownMenuItemIndicator>
              <span className="size-2 rounded-full flex bg-gray-400" />
            </DropdownMenuItemIndicator>
            Light
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="dark" className="flex items-center gap-2 px-2">
            <DropdownMenuItemIndicator>
              <span className="size-2 rounded-full flex bg-gray-400" />
            </DropdownMenuItemIndicator>
            Dark
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="system" className="flex items-center gap-2 px-2">
            <DropdownMenuItemIndicator>
              <span className="size-2 rounded-full flex bg-gray-400" />
            </DropdownMenuItemIndicator>
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
