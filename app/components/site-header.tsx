import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Monitor, Moon, SearchIcon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "~/assets/img/Logo vecto_png.png?url";
import { MainNav } from "~/components/main-nav";
import { MenuUser } from "~/components/menu-user";
import { MobileNav } from "~/components/mobile-nav";
import { Button } from "~/components/ui/button";
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
  const { pathname } = useLocation();
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
    <>
      {pathname === "/" ? (
        <div className="flex items-center justify-between bg-success px-4 py-1 text-tiny text-success-foreground md:px-10 lg:px-20">
          <span>Valorisons les talents, construisons une économie plus inclusive</span>
          <span className="hidden md:inline">
            Annuaire dédié aux travailleurs handicapés indépendants
          </span>
        </div>
      ) : null}

      <header className="sticky top-0 z-50 w-full bg-background text-foreground">
      <div className="flex h-16 items-stretch justify-between gap-2 px-4 md:px-10 lg:px-20">
        <div className="flex items-stretch gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Accueil Annuaire TIH"
          >
            <img src={logo} alt="Annuaire TIH" className="h-10 w-auto md:h-12" />
          </Link>
          <MainNav />
          <MobileNav />
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 border-0 bg-input text-foreground hover:bg-input/90"
                />
              }
            >
              <SearchIcon className="size-5" strokeWidth={1.8} />
              <span className="sr-only">Rechercher une entreprise</span>
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
          {user ? (
            <MenuUser user={user} />
          ) : (
            <>
              <LoginButton user={user} />
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

function RegisterLink({ user }: { user: AuthUser | undefined }) {
  return (
    <Link
      to={user ? "/compte/entreprises/create" : "/sign-up"}
      className="hidden h-10 items-center bg-card px-6 text-nowrap text-sm text-card-foreground transition-colors hover:bg-card/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex"
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
      className="hidden h-10 items-center bg-card px-6 text-nowrap text-sm text-card-foreground transition-colors hover:bg-card/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex"
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
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 border-0 bg-card text-card-foreground hover:bg-card/90"
          />
        }
      >
        <TriggerIcon data-icon="inline-start" className="size-5" />
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
