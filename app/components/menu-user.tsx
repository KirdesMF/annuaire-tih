import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BriefcaseBusiness, DiamondPlus, LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { isValidRole } from "~/db/schema/auth";
import { signOutFn } from "~/lib/api/auth/sign-out";
import type { AuthUser } from "~/lib/auth/auth.server";
import { type Theme, useTheme } from "./providers/theme-provider";
import { useToast } from "./ui/toast";

export function MenuUser({ user }: { user: AuthUser | undefined }) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const role = user?.role;
  const isAdmin = isValidRole(role) && (role === "admin" || role === "superadmin");

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
      <DropdownMenuTrigger className="rounded-full cursor-pointer focus:outline-2 focus:outline-ring focus:outline-offset-2">
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
              <DiamondPlus data-icon="inline-start" />
              <span className="text-xs">Référencer</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/compte/entreprises">
              <BriefcaseBusiness data-icon="inline-start" />
              <span className="text-xs">Mes entreprises</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/compte/preferences">
              <UserCog data-icon="inline-start" />
              <span className="text-xs">Mon compte</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin ? (
            <DropdownMenuItem asChild>
              <Link
                to="/admin/dashboard"
                search={{
                  view: "all",
                  q: "",
                  companyStatus: "all",
                  userRole: "all",
                }}
              >
                <LayoutDashboard data-icon="inline-start" />
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
              <LogOut data-icon="inline-start" />
              <span>Se déconnecter</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AvatarUser({ user }: { user: AuthUser }) {
  const initials = user.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  if (!user) return null;

  if (user.image) {
    return (
      <Avatar>
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
