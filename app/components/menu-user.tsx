import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { User } from "better-auth";
import { Avatar } from "radix-ui";
import { toast } from "sonner";
import { AddIcon } from "~/components/icons/add";
import { CompanyIcon } from "~/components/icons/company";
import { DashboardIcon } from "~/components/icons/dashboard";
import { LogoutIcon } from "~/components/icons/logout";
import { SettingsAccountIcon } from "~/components/icons/settings-account";
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
} from "~/components/ui/dropdown-menu";
import { useAdminRole } from "~/hooks/use-admin-role";
import { signOutFn } from "~/lib/api/auth/sign-out";
import { setColorSchemeFn } from "~/lib/cookies/color-scheme.cookie";
import { colorSchemeQuery } from "~/lib/cookies/color-scheme.cookie";

export function MenuUser({ user }: { user: User | undefined }) {
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
            <button type="button" onClick={() => signOut(undefined)}>
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
