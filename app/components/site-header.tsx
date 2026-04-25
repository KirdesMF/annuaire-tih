import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Monitor, Moon, SearchIcon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
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
import type { AuthUser } from "~/lib/auth/auth.server";
import { type Theme, useTheme } from "./providers/theme-provider";

export function SiteHeader({ user }: { user: AuthUser | undefined }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data: companies, isFetching } = useQuery(companiesByTermQuery(debouncedSearchTerm));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function onNavigate(path: string, slug: string) {
    setIsDialogOpen(false);
    navigate({ to: path, params: { slug } });
  }

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
    <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex flex-1 items-center justify-between gap-3">
        <MainNav />
        <MobileNav />

        <div className="flex-1 md:flex-none flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="flex h-8 w-full items-center gap-2 text-nowrap rounded-lg border border-input px-2.5 text-xs font-light shadow-2xs outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:w-auto"
                />
              }
            >
              <SearchIcon className="size-4 text-muted-foreground" />
              <span className="hidden lg:block">Rechercher un nom ou une activité...</span>
              <span className="block lg:hidden">Rechercher...</span>
              <kbd className="pointer-events-none hidden gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs lg:flex">
                <span>⌘</span>
                <span>K</span>
              </kbd>
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
                    <CommandItem
                      key={company.id}
                      onSelect={() => onNavigate("/entreprises/$slug", company.slug)}
                    >
                      {company.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>

          <RegisterLink user={user} />
          <LoginButton user={user} />
          {user ? <MenuUser user={user} /> : <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}

function RegisterLink({ user }: { user: AuthUser | undefined }) {
  return (
    <Link
      to={user ? "/compte/entreprises/create" : "/sign-up"}
      className="hidden h-8 items-center text-nowrap rounded-lg border border-border px-2.5 text-xs transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex"
    >
      Se référencer
    </Link>
  );
}

function LoginButton({ user }: { user: AuthUser | undefined }) {
  if (user) return null;

  return (
    <Link
      to="/sign-in"
      className="hidden h-8 items-center text-nowrap rounded-lg bg-primary px-2.5 text-xs text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex"
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
      <DropdownMenuTrigger render={<Button type="button" variant="outline" size="icon" />}>
        <TriggerIcon data-icon="inline-start" />
        <span className="sr-only">Modifier le thème</span>
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
