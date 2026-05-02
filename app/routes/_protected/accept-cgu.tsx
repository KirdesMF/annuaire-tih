import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Loader } from "lucide-react";
import { getDb } from "~/db";
import { userCguAcceptanceTable } from "~/db/schema/cgu";
import { requireCurrentUser } from "~/lib/auth/permissions.server";

export const Route = createFileRoute("/_protected/accept-cgu")({
  component: RouteComponent,
});

const acceptCGUFn = createServerFn({ method: "POST" }).handler(async () => {
  const user = await requireCurrentUser();
  const db = getDb();

  await db.transaction(async (tx) => {
        const activeCGU = await tx.query.cguTable.findFirst({
          where: (cgu, { eq }) => eq(cgu.isActive, true),
        });

        if (!activeCGU) {
          throw new Error("No active CGU found");
        }

    await tx.insert(userCguAcceptanceTable).values({
      userId: user.id,
      cguId: activeCGU.id,
      acceptedAt: new Date(),
    });
  });

  throw redirect({ to: "/compte/entreprises" });
});

function RouteComponent() {
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(acceptCGUFn) });

  function onAccept() {
    mutate({});
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
