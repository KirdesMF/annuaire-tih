import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader } from "lucide-react";
import { acceptCurrentCguFn } from "~/lib/api/cgu/accept-cgu";

export const Route = createFileRoute("/_protected/accept-cgu")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(acceptCurrentCguFn) });

  function onAccept() {
    mutate(undefined, {
      onSuccess: () => navigate({ to: "/compte/entreprises" }),
    });
  }

  return (
    <main className="p-4">
      <div className="max-w-md mx-auto py-24 min-h-svh">
        <div className="border border-border bg-accent text-accent-foreground rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-6 tracking-tighter">
            Conditions générales d'utilisation
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            Afin de pouvoir accéder à l'application, vous devez accepter les{" "}
            <Link to="/cgu" className="text-blue-500 underline">
              conditions générales d'utilisation
            </Link>
            .
          </p>

          <p className="text-sm text-muted-foreground mb-4">
            Vous pouvez accepter les conditions générales d'utilisation en cliquant sur le bouton
            "Accepter" ci-dessous.
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            Si vous refusez les conditions générales d'utilisation, vous ne pourrez pas accéder à
            votre compte.
          </p>

          <div className="flex gap-2 justify-end">
            <Link
              to="/"
              type="button"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm"
            >
              Refuser
            </Link>

            <button
              type="button"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm"
              onClick={onAccept}
              disabled={isPending}
            >
              {isPending ? <Loader className="animate-spin size-5" /> : "Accepter"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
