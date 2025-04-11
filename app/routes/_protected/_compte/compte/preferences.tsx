import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/_compte/compte/preferences")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container px-4 py-6">
			<header className="mb-6">
				<h1 className="text-2xl font-bold">Préférences utilisateur</h1>
				<p>Modifiez vos préférences utilisateur pour personnaliser votre expérience sur le site.</p>
			</header>

			<div className="grid gap-4">
				<article className="border border-gray-300 p-4 rounded-sm">
					<h2 className="text-xl font-bold">Informations personnelles</h2>
				</article>

				<article className="border border-gray-300 p-4 rounded-sm">
					<h2 className="text-xl font-bold">Supprimer mon compte</h2>
				</article>
			</div>
		</div>
	);
}
