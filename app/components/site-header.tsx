import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { User } from "better-auth";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDebounce } from "~/hooks/use-debounce";
import { companiesByTermQuery } from "~/lib/api/companies/queries/get-companies-by-term";
import { type Theme, useTheme } from "./providers/theme-provider";

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
    <header className="px-4 md:px-8 py-3 border-b-[0.5px] border-border backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="flex items-center gap-2 justify-between">
        <MainNav />
        <MobileNav />

        <div className="flex-1 md:flex-none flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-full md:w-auto items-center gap-2 text-start text-xs text-nowrap font-light px-2.5 h-8 border border-border rounded-sm focus-within:outline focus-within:outline-blue-500"
              >
                <span className="hidden lg:block">Rechercher un nom ou une activité...</span>
                <span className="block lg:hidden">Rechercher...</span>
                <kbd className="text-xs px-1.5 py-0.5 rounded-sm bg-muted pointer-events-none hidden lg:flex gap-1 font-mono">
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
      className="text-xs px-2 py-1 h-8 items-center rounded-sm border border-border text-nowrap hidden md:inline-flex"
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
      className="text-xs px-2 py-1 h-8 hidden md:inline-flex items-center rounded-sm text-nowrap bg-primary text-primary-foreground"
    >
      Se connecter
    </Link>
  );
}

const TRIGGER_THEME_ICON = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const TriggerIcon = TRIGGER_THEME_ICON[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-xs px-2 py-1 h-8 inline-flex items-center rounded-sm border border-border text-nowrap cursor-pointer"
        >
          <TriggerIcon className="size-4" />
          <span className="sr-only">Modifier le thème</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5} align="end" className="min-w-32">
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          <DropdownMenuRadioItem value="light" className="flex items-center gap-2 px-2 group">
            <div className="flex items-center gap-2">
              <Sun size={16} className="group-aria-checked:text-primary" />
              Light
            </div>
          </DropdownMenuRadioItem>

          <DropdownMenuSeparator className="h-px bg-border my-1" />

          <DropdownMenuRadioItem value="dark" className="flex items-center gap-2 px-2 group">
            <div className="flex items-center gap-2">
              <Moon size={16} className="group-aria-checked:text-primary" />
              Dark
            </div>
          </DropdownMenuRadioItem>

          <DropdownMenuSeparator className="h-px bg-border my-1" />

          <DropdownMenuRadioItem value="system" className="flex items-center gap-2 px-2 group">
            <div className="flex items-center gap-2">
              <Monitor size={16} className="group-aria-checked:text-primary" />
              System
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
