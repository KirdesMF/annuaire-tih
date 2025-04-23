import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/compte/preferences")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext();
  return (
    <div className="container px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Préférences utilisateur</h1>
        <p>Modifiez vos préférences utilisateur pour personnaliser votre expérience sur le site.</p>
      </header>

      <div className="grid gap-4">
        <article className="border border-gray-300 p-4 rounded-sm">
          <h2 className="text-xl font-bold mb-2">Informations personnelles</h2>
          <div className="flex flex-col gap-2">
            <p>{context.user.name}</p>
            <p>{context.user.email}</p>
          </div>
        </article>

        <article className="border border-gray-300 p-4 rounded-sm">
          <h2 className="text-xl font-bold">Supprimer mon compte</h2>
        </article>
      </div>
    </div>
  );
}
