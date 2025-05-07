import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Separator } from "radix-ui";
import { userCompaniesQuery } from "~/lib/api/users/queries/get-user-companies";

export const Route = createFileRoute("/_protected/compte")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(userCompaniesQuery(context.user.id));
  },
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const companies = useSuspenseQuery(userCompaniesQuery(context.user.id));

  return (
    <div className="flex min-h-[calc(100svh-45px)]">
      <aside className="inset-y-0 border-e border-border">
        <nav className="sticky top-16 py-2 px-1">
          <ul className="flex flex-col gap-2">
            <li className="flex flex-col gap-1">
              <Link
                to="/compte/entreprises"
                className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none transition-colors data-[status=active]:text-primary data-[status=active]:font-medium"
              >
                Mes entreprises
              </Link>

              <ul className="ms-4">
                <li>
                  <Link
                    to="/compte/entreprises/create"
                    className="text-xs font-light flex items-center gap-1 px-4 py-1.5 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed data-[status=active]:text-primary data-[status=active]:font-medium"
                    disabled={companies.data && companies.data.length >= 3}
                  >
                    <Plus className="size-3" />
                    Référencer
                  </Link>
                </li>
              </ul>
            </li>

            <Separator.Root orientation="horizontal" decorative className="h-px bg-border -mx-1" />

            <li>
              <Link
                to="/compte/preferences"
                className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none transition-colors data-[status=active]:text-primary data-[status=active]:font-medium"
              >
                Préférences
              </Link>
            </li>

            <Separator.Root orientation="horizontal" decorative className="h-px bg-border -mx-1" />
          </ul>
        </nav>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
