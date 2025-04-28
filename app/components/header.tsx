import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, linkOptions } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { User } from "better-auth";
import { Avatar } from "radix-ui";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminRole } from "~/hooks/use-admin-role";
import { useDebounce } from "~/hooks/use-debounce";
import { signOutFn } from "~/lib/api/auth/sign-out";
import { companiesByTermQuery } from "~/lib/api/companies/queries/get-companies-by-term";
import { colorSchemeQuery, setColorSchemeFn } from "~/lib/cookies/color-scheme.cookie";
import { AddIcon } from "./icons/add";
import { ColorSchemeIcon } from "./icons/color-scheme";
import { CompanyIcon } from "./icons/company";
import { DashboardIcon } from "./icons/dashboard";
// import { LinkedinIcon } from "./icons/linkedin";
import { LogoutIcon } from "./icons/logout";
import { SettingsAccountIcon } from "./icons/settings-account";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "./ui/command";
import { Command } from "./ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "./ui/popover";
import { Popover } from "./ui/popover";

const LINKS = linkOptions([
  { label: "Qui sommes-nous ?", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Sources", to: "/sources" },
  { label: "Contact", to: "/contact" },
]);

export function Header({ user }: { user: User | undefined }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data: companies, isFetching } = useQuery(companiesByTermQuery(debouncedSearchTerm));

  return (
    <header className="px-16 py-3 border-b border-gray-200 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Link to="/" className="text-sm font-light">
                Annuaire TIH
              </Link>
            </li>
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm font-light"
                  activeProps={{ className: "text-blue-700" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-start text-xs text-nowrap font-light px-4 py-2 border border-gray-400 rounded-sm bg-white w-80 focus-within:outline focus-within:outline-blue-500"
              >
                Rechercher un nom ou une activité...
              </button>
            </PopoverTrigger>

            <PopoverContent>
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
            </PopoverContent>
          </Popover>

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
          {user ? <LoggedUserMenu user={user} /> : <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}

function RegisterLink({ user }: { user: User | undefined }) {
  if (user) return null;

  return (
    <Link to="/signup" className="text-xs px-2 py-1 rounded-sm border border-gray-400">
      Se référencer
    </Link>
  );
}

function LoginButton({ user }: { user: User | undefined }) {
  if (user) return null;

  return (
    <Link
      to="/login"
      className="text-xs px-2 py-1 rounded-sm border border-gray-400 cursor-pointer"
    >
      Login
    </Link>
  );
}

function LoggedUserMenu({ user }: { user: User | undefined }) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminRole();
  const { data: colorScheme } = useQuery(colorSchemeQuery);

  const { mutate: signOut } = useMutation({
    mutationFn: useServerFn(signOutFn),
    onSuccess: () => toast.success("Vous êtes déconnecté"),
  });

  const { mutate: setColorScheme } = useMutation({
    mutationFn: setColorSchemeFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["color-scheme"] }),
  });

  function onLogout() {
    signOut(undefined);
  }

  function onSelectColorScheme(scheme: "light" | "dark" | "system") {
    setColorScheme({ data: scheme }, { onSuccess: () => toast.success("Thème mis à jour") });
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full cursor-pointer">
        <AvatarUser user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={2} align="end" className="min-w-64">
        <div className="flex flex-col p-2">
          <span className="text-sm">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>

        <DropdownMenuSeparator className="h-px bg-gray-200 my-1 -mx-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/compte/entreprises/create">
              <AddIcon className="size-4" />
              <span className="text-xs">Référencer</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/compte/entreprises">
              <CompanyIcon className="size-4" />
              <span className="text-xs">Mes entreprises</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/compte/preferences">
              <SettingsAccountIcon className="size-4" />
              <span className="text-xs">Mon compte</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin ? (
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard">
                <DashboardIcon className="size-4" />
                <span className="text-xs">Admin dashboard</span>
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="h-px bg-gray-200 my-1 -mx-1" />

        <DropdownMenuGroup>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: dropdown menu */}
          <DropdownMenuLabel className="text-sm font-light px-2 py-1.5">Thème</DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={colorScheme}
            onValueChange={(value) => onSelectColorScheme(value as "light" | "dark" | "system")}
          >
            <DropdownMenuRadioItem value="light" className="relative ps-8 ">
              <DropdownMenuItemIndicator className="absolute start-2">
                <span className="size-2 rounded-full flex bg-gray-400" />
              </DropdownMenuItemIndicator>
              Light
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="dark" className="relative ps-8">
              <DropdownMenuItemIndicator className="absolute start-2">
                <span className="size-2 rounded-full flex bg-gray-400" />
              </DropdownMenuItemIndicator>
              Dark
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="system" className="relative ps-8">
              <DropdownMenuItemIndicator className="absolute start-2">
                <span className="size-2 rounded-full flex bg-gray-400" />
              </DropdownMenuItemIndicator>
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="h-px bg-gray-200 my-1 -mx-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <button type="button" onClick={onLogout}>
              <LogoutIcon className="size-4" />
              <span>Se déconnecter</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AvatarUser({ user }: { user: User }) {
  const initials = user.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  if (!user) return null;

  if (user.image) {
    return (
      <Avatar.Root className="size-8 rounded-full">
        <Avatar.Image src={user.image} alt={user.name} className="size-full rounded-full" />
        <Avatar.Fallback className="size-full leading-1">{initials}</Avatar.Fallback>
      </Avatar.Root>
    );
  }

  return (
    <Avatar.Root className="size-8 rounded-full border border-gray-200 flex">
      <Avatar.Fallback className="size-full leading-1 text-xs grid place-items-center text-blue-500">
        {initials}
      </Avatar.Fallback>
    </Avatar.Root>
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
          className="text-xs px-2 py-1 rounded-sm border border-gray-400 cursor-pointer"
        >
          <ColorSchemeIcon className="size-4" />
          <span className="sr-only">Thème</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={2} align="end">
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
