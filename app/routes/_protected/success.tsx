import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/success")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold">Votre compte a été confirmé avec succès</h1>
				<Link to="/account">Mon compte</Link>
			</div>
		</main>
	);
}
