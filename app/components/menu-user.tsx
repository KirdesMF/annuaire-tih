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
      <DropdownMenuTrigger
        aria-label="Ouvrir le menu utilisateur"
        className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-card text-card-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        <AvatarUser user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={2} align="end" className="min-w-64">
        <div className="flex flex-col p-2">
          <span className="text-sm">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>

        <DropdownMenuSeparator className="h-px bg-border my-1 -mx-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to="/compte/entreprises/create" />}>
            <DiamondPlus data-icon="inline-start" />
            <span className="text-xs">Référencer</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link to="/compte/entreprises" />}>
            <BriefcaseBusiness data-icon="inline-start" />
            <span className="text-xs">Mes entreprises</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link to="/compte/preferences" />}>
            <UserCog data-icon="inline-start" />
            <span className="text-xs">Mon compte</span>
          </DropdownMenuItem>

          {isAdmin ? (
            <DropdownMenuItem
              render={
                <Link
                  to="/admin/dashboard"
                  search={{
                    view: "all",
                    q: "",
                    companyStatus: "all",
                    userRole: "all",
                  }}
                />
              }
            >
              <LayoutDashboard data-icon="inline-start" />
              <span className="text-xs">Admin dashboard</span>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="h-px bg-border my-1 -mx-1" />

        <DropdownMenuGroup>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: dropdown menu */}
          <DropdownMenuLabel className="text-sm font-light px-2 py-1.5">Thème</DropdownMenuLabel>

          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="h-px bg-border my-1 -mx-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut(undefined)}>
            <LogOut data-icon="inline-start" />
            <span>Se déconnecter</span>
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
      <Avatar size="lg">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar size="lg">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
