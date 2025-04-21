import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();

	return (
		<div className="container px-4 py-6">
			<h1 className="text-2xl font-bold">Modifier l'entreprise</h1>

			<nav className="flex gap-2">
				<Link to="/compte/entreprises/$slug/edit/infos" params={{ slug: params.slug }}>
					Infos
				</Link>
				<Link to="/compte/entreprises/$slug/edit/medias" params={{ slug: params.slug }}>
					Média
				</Link>
				<Link to="/compte/entreprises/$slug/edit/preview" params={{ slug: params.slug }}>
					Previsualiser
				</Link>
			</nav>

			<Outlet />
		</div>
	);
}
