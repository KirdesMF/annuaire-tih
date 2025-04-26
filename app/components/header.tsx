import { Link, useRouter } from "@tanstack/react-router";
import { LinkedinIcon } from "./icons/linkedin";
import { Avatar, DropdownMenu } from "radix-ui";
import { LogoutIcon } from "./icons/logout";
import { SettingsAccountIcon } from "./icons/settings-account";
import { CompanyIcon } from "./icons/company";
import { AddIcon } from "./icons/add";
import { DashboardIcon } from "./icons/dashboard";
import { useAdminRole } from "~/hooks/use-admin-role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { auth } from "~/lib/auth/auth.server";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { User } from "better-auth";
import { linkOptions } from "@tanstack/react-router";
import { companiesByTermQuery } from "~/lib/api/companies/queries/get-companies-by-term";
import { useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import {
  CommandList,
  CommandEmpty,
  CommandInput,
  CommandSeparator,
  CommandItem,
  CommandLoading,
} from "./ui/command";
import { PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "./ui/popover";
import { Popover } from "./ui/popover";
import { Command } from "./ui/command";
import { colorSchemeQuery, setColorSchemeFn } from "~/lib/cookies/color-scheme.cookie";

const LINKS = linkOptions([
  { label: "Qui sommes-nous ?", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Sources", to: "/sources" },
  { label: "Contact", to: "/contact" },
]);

const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const request = getWebRequest();
  if (!request) throw new Error("No request");
  await auth.api.signOut({ headers: request.headers });
});

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

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-start text-xs text-nowrap font-light px-4 border border-gray-400 rounded-sm bg-white w-80 h-8 focus-within:outline focus-within:outline-blue-500"
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

          <a
            href="https://linkedin.com/groups/13011531"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
          >
            <LinkedinIcon className="size-5" />
          </a>

          <RegisterLink user={user} />
          <LoginButton user={user} />
          <LoggedUserMenu user={user} />
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin } = useAdminRole();
  const { data: colorScheme } = useQuery(colorSchemeQuery);

  const { mutate: signOut } = useMutation({
    mutationFn: useServerFn(signOutFn),
  });
  const { mutate: setColorScheme } = useMutation({
    mutationFn: useServerFn(setColorSchemeFn),
  });

  if (!user) return null;

  async function onLogout() {
    signOut(undefined, {
      onSuccess: () => {
        queryClient.clear();
        toast.success("Vous êtes déconnecté");
        router.navigate({ to: "/" });
      },
    });
  }

  function onSelectColorScheme(scheme: "light" | "dark" | "system") {
    setColorScheme(
      { data: scheme },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["color-scheme"] });
          toast.success("Thème mis à jour");
        },
      },
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="rounded-full cursor-pointer">
        <AvatarUser user={user} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={2}
          align="end"
          className="bg-white border rounded-sm border-gray-200 min-w-64 overflow-hidden p-1 shadow-xs dark:bg-gray-900 dark:border-gray-400"
        >
          <div className="flex flex-col p-2">
            <span className="text-sm">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>

          <DropdownMenu.Separator className="h-px bg-gray-200 my-1 -mx-1" />

          <DropdownMenu.Group>
            <DropdownMenu.Item asChild>
              <Link
                to="/compte/entreprises/create"
                className="outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none dark:data-highlighted:bg-gray-800"
              >
                <AddIcon className="size-4" />
                <span className="text-xs">Référencer</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                to="/compte/entreprises"
                className="outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none dark:data-highlighted:bg-gray-800"
              >
                <CompanyIcon className="size-4" />
                <span className="text-xs">Mes entreprises</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                to="/compte/preferences"
                className="outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none dark:data-highlighted:bg-gray-800"
              >
                <SettingsAccountIcon className="size-4" />
                <span className="text-xs">Mon compte</span>
              </Link>
            </DropdownMenu.Item>

            {isAdmin ? (
              <DropdownMenu.Item asChild>
                <Link
                  to="/admin/dashboard"
                  className="outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none dark:data-highlighted:bg-gray-800"
                >
                  <DashboardIcon className="size-4" />
                  <span className="text-xs">Admin dashboard</span>
                </Link>
              </DropdownMenu.Item>
            ) : null}
          </DropdownMenu.Group>

          <DropdownMenu.Separator className="h-px bg-gray-200 my-1 -mx-1" />

          <DropdownMenu.Group>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: dropdown menu */}
            <DropdownMenu.Label className="text-sm font-light px-2 py-1.5">
              Thème
            </DropdownMenu.Label>

            <DropdownMenu.RadioGroup
              value={colorScheme}
              onValueChange={(value) => {
                console.log("value", value);
                onSelectColorScheme(value as "light" | "dark" | "system");
              }}
            >
              <DropdownMenu.RadioItem
                value="light"
                className="text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center dark:data-highlighted:bg-gray-800"
                onSelect={() => onSelectColorScheme("light")}
              >
                <DropdownMenu.ItemIndicator className="absolute start-2">
                  <span className="size-2 rounded-full flex bg-gray-400" />
                </DropdownMenu.ItemIndicator>
                Light
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                value="dark"
                className="text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center dark:data-highlighted:bg-gray-800"
                onSelect={() => onSelectColorScheme("dark")}
              >
                <DropdownMenu.ItemIndicator className="absolute start-2">
                  <span className="size-2 rounded-full flex bg-gray-400" />
                </DropdownMenu.ItemIndicator>
                Dark
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                value="system"
                className="text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center dark:data-highlighted:bg-gray-800"
                onSelect={() => onSelectColorScheme("system")}
              >
                <DropdownMenu.ItemIndicator className="absolute start-2">
                  <span className="size-2 rounded-full flex bg-gray-400" />
                </DropdownMenu.ItemIndicator>
                System
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Group>

          <DropdownMenu.Separator className="h-px bg-gray-200 my-1 -mx-1" />

          <DropdownMenu.Group>
            <DropdownMenu.Item
              onSelect={() => onLogout()}
              className="text-xs px-2 py-1.5 outline-none cursor-pointer flex items-center gap-2 data-highlighted:bg-gray-100 dark:data-highlighted:bg-gray-800"
            >
              <LogoutIcon className="size-4" />
              <span>Se déconnecter</span>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function AvatarUser({ user }: { user: User }) {
  if (!user) return null;

  const initials = user.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

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
