import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { userCompaniesQuery } from "~/lib/api/users/queries/get-user-companies";

export const Route = createFileRoute("/_protected/compte")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (!context.user?.id) return;
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
                {companies.data?.map((company) => (
                  <li key={company.id}>
                    <Link
                      to="/compte/entreprises/$slug/edit/infos"
                      params={{ slug: company.slug }}
                      search={{ id: context.user.id }}
                      className="text-xs font-light flex items-center px-4 py-1.5 text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary data-[status=active]:font-medium"
                    >
                      {company.name}
                    </Link>
                  </li>
                ))}

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

            <Separator orientation="horizontal" className="-mx-1 h-px bg-border" />

            <li>
              <Link
                to="/compte/preferences"
                className="text-sm font-light flex ps-4 pe-8 py-1.5 select-none transition-colors data-[status=active]:text-primary data-[status=active]:font-medium"
              >
                Préférences
              </Link>
            </li>

            <Separator orientation="horizontal" className="-mx-1 h-px bg-border" />
          </ul>
        </nav>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
