import { createFileRoute, Link, linkOptions, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit")({
  component: RouteComponent,
});

const navigation = (slug: string) =>
  linkOptions([
    { label: "Infos", to: "/compte/entreprises/$slug/edit/infos", params: { slug } },
    { label: "Média", to: "/compte/entreprises/$slug/edit/medias", params: { slug } },
    {
      label: "Previsualiser",
      to: "/compte/entreprises/$slug/edit/preview",
      params: { slug },
    },
  ]);

function RouteComponent() {
  const params = Route.useParams();

  return (
    <div className="container px-4 py-6">
      <nav className="mb-6 sticky top-0 bg-white">
        <ul className="flex shadow-[inset_0_-1px_0_0_var(--color-gray-300)]">
          {navigation(params.slug).map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                params={link.params}
                className="text-sm font-medium px-4 h-10 flex items-center"
                activeProps={{
                  className: "text-blue-700 shadow-[inset_0_-2px_0_0_var(--color-blue-700)]",
                }}
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
