import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { User } from "better-auth";
import { BriefcaseBusiness, DiamondPlus, LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { Avatar } from "radix-ui";
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
import { type Theme, useTheme } from "./providers/theme-provider";
import { useToast } from "./ui/toast";

export function MenuUser({ user }: { user: User | undefined }) {
  const { isAdmin } = useAdminRole();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const { mutate: signOut } = useMutation({
    mutationFn: useServerFn(signOutFn),
    onSuccess: () =>
      toast({
        status: "success",
        description: "Vous avez été déconnecté avec succès",
        button: { label: "Fermer" },
      }),
  });

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full cursor-pointer focus:outline-primary focus:outline-2">
        <AvatarUser user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={2} align="end" className="min-w-64">
        <div className="flex flex-col p-2">
          <span className="text-sm">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>

        <DropdownMenuSeparator className="h-px bg-border my-1 -mx-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/compte/entreprises/create">
              <DiamondPlus className="size-4" />
              <span className="text-xs">Référencer</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/compte/entreprises">
              <BriefcaseBusiness className="size-4" />
              <span className="text-xs">Mes entreprises</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/compte/preferences">
              <UserCog className="size-4" />
              <span className="text-xs">Mon compte</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin ? (
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard">
                <LayoutDashboard className="size-4" />
                <span className="text-xs">Admin dashboard</span>
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="h-px bg-border my-1 -mx-1" />

        <DropdownMenuGroup>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: dropdown menu */}
          <DropdownMenuLabel className="text-sm font-light px-2 py-1.5">Thème</DropdownMenuLabel>

          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <DropdownMenuRadioItem value="light" className="relative ps-8 ">
              <DropdownMenuItemIndicator className="absolute start-2 top-1/2 -translate-y-1/2">
                <span className="size-2 rounded-full flex bg-accent-foreground" />
              </DropdownMenuItemIndicator>
              Light
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="dark" className="relative ps-8">
              <DropdownMenuItemIndicator className="absolute start-2 top-1/2 -translate-y-1/2">
                <span className="size-2 rounded-full flex bg-accent-foreground" />
              </DropdownMenuItemIndicator>
              Dark
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="system" className="relative ps-8">
              <DropdownMenuItemIndicator className="absolute start-2 top-1/2 -translate-y-1/2">
                <span className="size-2 rounded-full flex bg-accent-foreground" />
              </DropdownMenuItemIndicator>
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="h-px bg-border my-1 -mx-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <button type="button" onClick={() => signOut(undefined)}>
              <LogOut className="size-4" />
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
    <Avatar.Root className="size-8 rounded-full bg-secondary flex">
      <Avatar.Fallback className="size-full leading-1 text-xs grid place-items-center text-secondary-foreground">
        {initials}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
