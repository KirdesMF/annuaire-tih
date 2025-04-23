import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import type { User } from "better-auth";
import { Avatar, Separator } from "radix-ui";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { deleteUser } from "~/lib/api/users/mutations/delete-user";
import { updateUserInfos } from "~/lib/api/users/mutations/update-user-infos";
import { updateUserPasswordFn } from "~/lib/api/users/mutations/update-user-password";

export const Route = createFileRoute("/_protected/compte/preferences")({
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenPassword, setIsModalOpenPassword] = useState(false);
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(deleteUser) });
  const { mutate: update, isPending: isUpdatingUserInfos } = useMutation({
    mutationFn: useServerFn(updateUserInfos),
  });
  const { mutate: updatePassword, isPending: isUpdatingUserPassword } = useMutation({
    mutationFn: useServerFn(updateUserPasswordFn),
  });

  function onDelete() {
    mutate({ data: { userId: context.user.id } });
  }

  function onUpdateUserName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    update(
      { data: formData },
      {
        onSuccess: async () => {
          await context.queryClient.invalidateQueries({
            queryKey: ["user", "session"],
            refetchType: "all",
          });
          toast.success("Nom et prénom modifié avec succès");
        },
      },
    );
  }

  function onUpdateUserPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    updatePassword(
      { data: formData },
      {
        onSuccess: () => {
          setIsModalOpenPassword(false);
          toast.success("Mot de passe modifié avec succès");
        },
      },
    );
  }

  return (
    <div className="container px-4 py-6">
      <header>
        <h1 className="text-2xl font-bold">Préférences utilisateur</h1>
        <p>Modifiez vos préférences utilisateur pour personnaliser votre expérience sur le site.</p>
      </header>

      <Separator.Root className="my-8 h-px bg-gray-300" />

      <div className="grid gap-8">
        <article className="border border-gray-300 p-4 rounded-sm flex justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Avatar</h2>
            <p className="text-sm text-pretty">
              Votre avatar est votre image de profil. Vous pouvez le modifier en cliquant sur
              l'avatar.
            </p>
          </div>

          <div className="flex justify-center px-4">
            <AvatarUser user={context.user} />
          </div>
        </article>

        <article className="border border-gray-300 p-4 rounded-sm">
          <form onSubmit={onUpdateUserName}>
            <div className="flex flex-col gap-2 py-4">
              <h2 className="text-xl font-bold">Nom et prénom</h2>
              <p className="text-sm text-pretty">
                Votre nom et prénom sont utilisés pour identifier votre compte. Vous pouvez le
                modifier en cliquant sur le bouton ci-dessous.
              </p>
              <Label>
                <span className="sr-only">Nom et prénom</span>
                <Input name="name" defaultValue={context.user.name} className="max-w-1/3 text-sm" />
              </Label>
            </div>

            <Separator.Root className="my-4 -mx-4 h-px bg-gray-300" />

            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-gray-500 text-white px-4 py-2 rounded-sm text-xs"
                disabled={isUpdatingUserInfos}
              >
                {isUpdatingUserInfos ? "Modification en cours..." : "Modifier mon nom et prénom"}
              </button>
            </div>
          </form>
        </article>

        <article className="border border-gray-300 p-4 rounded-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Email</h2>
            <p className="text-sm text-pretty">
              Un email de confirmation vous sera envoyé afin de vérifier votre identité
            </p>
            <Label>
              <span className="sr-only">Email</span>
              <Input defaultValue={context.user.email} className="max-w-1/3 text-sm" />
            </Label>
          </div>

          <Separator.Root className="my-4 -mx-4 h-px bg-gray-300" />

          <div className="flex gap-2 justify-end">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-sm text-xs">
              Modifier mon email
            </button>
          </div>
        </article>

        <article className="border border-gray-300 p-4 rounded-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Mot de passe</h2>
            <p className="text-sm text-pretty">
              Votre mot de passe est utilisé pour accéder à votre compte. Vous pouvez le modifier en
              cliquant sur le bouton ci-dessous.
            </p>
            <Label>
              <span className="sr-only">Mot de passe</span>
              <Input
                type="password"
                name="password"
                defaultValue="password"
                className="max-w-1/3 text-sm"
              />
            </Label>
          </div>

          <Separator.Root className="my-4 -mx-4 h-px bg-gray-300" />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-sm text-xs"
              onClick={() => setIsModalOpenPassword(true)}
            >
              Modifier mon mot de passe
            </button>

            <Dialog open={isModalOpenPassword} onOpenChange={setIsModalOpenPassword}>
              <DialogContent>
                <DialogTitle>Modifier mon mot de passe</DialogTitle>

                <Separator.Root className="my-4 -mx-4 h-px bg-gray-300" />

                <DialogDescription className="mb-6">
                  Veuillez entrer votre mot de passe actuel et votre nouveau mot de passe.
                </DialogDescription>

                <form onSubmit={onUpdateUserPassword}>
                  <div className="flex flex-col gap-4 mb-4">
                    <Label className="flex flex-col gap-2">
                      <span className="text-sm">Mot de passe actuel</span>
                      <Input type="password" name="password" className="text-sm" />
                    </Label>

                    <Label className="flex flex-col gap-2">
                      <span className="text-sm">Nouveau mot de passe</span>
                      <Input type="password" name="newPassword" className="text-sm" />
                    </Label>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-sm text-xs"
                      onClick={() => setIsModalOpenPassword(false)}
                    >
                      Annuler
                    </button>

                    <button
                      type="submit"
                      className="bg-gray-500 text-white px-4 py-2 rounded-sm text-xs"
                    >
                      {isUpdatingUserPassword
                        ? "Modification en cours..."
                        : "Modifier mon mot de passe"}
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </article>

        <Separator.Root className="my-8 h-px bg-gray-300" />

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

function AvatarUser({ user }: { user: User }) {
  if (!user) return null;

  const initials = user.name
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  if (user.image) {
    return (
      <Avatar.Root className="size-16 rounded-full">
        <Avatar.Image src={user.image} alt={user.name} className="size-full rounded-full" />
        <Avatar.Fallback className="size-full leading-1">{initials}</Avatar.Fallback>
      </Avatar.Root>
    );
  }

  return (
    <Avatar.Root className="size-16 rounded-full border border-gray-200 flex">
      <Avatar.Fallback className="size-full leading-1 text-2xl grid place-items-center text-blue-500">
        {initials}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
