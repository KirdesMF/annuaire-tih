import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Separator } from "radix-ui";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { deleteUser } from "~/lib/api/users/mutations/delete-user";

export const Route = createFileRoute("/_protected/compte/preferences")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(deleteUser) });

  function onDelete() {
    mutate({ data: { userId: context.user.id } });
  }

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

        <article className="border border-red-500 rounded-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2 p-4">
            <h2 className="text-lg font-bold">Supprimer mon compte</h2>
            <p>
              Supprimer votre compte utilisateur et toutes vos données associées. Cette action est
              irréversible.
            </p>
          </div>

          <div className="flex justify-end p-4 border-t border-red-500">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-sm text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Supprimer mon compte
            </button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogTitle>Supprimer mon compte</DialogTitle>

                <Separator.Root className="my-4 -mx-4 h-px bg-gray-300" />

                <DialogDescription className="mb-6">
                  Si vous souhaitez supprimer votre compte, veuillez cliquer sur le bouton
                  ci-dessous.
                </DialogDescription>

                <div className="flex justify-end gap-2 px-2">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-sm text-xs"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-sm text-xs"
                    disabled={isPending}
                    onClick={onDelete}
                  >
                    {isPending ? "Suppression en cours..." : "Supprimer mon compte"}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </article>
      </div>
    </div>
  );
}
