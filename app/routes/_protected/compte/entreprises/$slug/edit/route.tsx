import { Link, Outlet, createFileRoute, linkOptions, redirect } from "@tanstack/react-router";
import * as v from "valibot";

const searchParamsSchema = v.object({
  id: v.string(),
});

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit")({
  validateSearch: searchParamsSchema,
  beforeLoad: async ({ context, search }) => {
    const user = context.user;

    if ((search.id !== user.id && user.role !== "admin") || !search.id) {
      throw redirect({ to: "/compte/entreprises" });
    }
  },
  component: RouteComponent,
});

const navigation = (slug: string, id: string) =>
  linkOptions([
    {
      label: "Infos",
      to: "/compte/entreprises/$slug/edit/infos",
      params: { slug },
      search: { id },
    },
    {
      label: "Média",
      to: "/compte/entreprises/$slug/edit/medias",
      params: { slug },
      search: { id },
    },
    // {
    //   label: "Previsualiser",
    //   to: "/compte/entreprises/$slug/edit/preview",
    //   params: { slug },
    // },
  ]);

function RouteComponent() {
  const params = Route.useParams();
  const context = Route.useRouteContext();

  const links = navigation(params.slug, context.user.id);

  return (
    <div className="container px-4">
      <nav className="mb-6 sticky top-16  backdrop-blur-xs py-2">
        <ul className="flex shadow-[inset_0_-1px_0_0_var(--color-border)]">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                params={link.params}
                search={link.search}
                className="text-sm font-medium px-4 h-10 flex items-center data-[status=active]:text-primary data-[status=active]:shadow-[inset_0_-2px_0_0_var(--color-primary)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
