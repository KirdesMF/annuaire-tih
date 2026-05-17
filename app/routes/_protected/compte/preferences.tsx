import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Loader, Lock, Mail, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { type ChangeEvent, type SyntheticEvent, useEffect, useState } from "react";
import { InputFile } from "~/components/input-file";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/toast";
import { deleteUser } from "~/lib/api/users/mutations/delete-user";
import { updateUserAvatar } from "~/lib/api/users/mutations/update-user-avatar";
import { updateUserEmailFn } from "~/lib/api/users/mutations/update-user-email";
import { updateUserInfos } from "~/lib/api/users/mutations/update-user-infos";
import { updateUserPasswordFn } from "~/lib/api/users/mutations/update-user-password";
import { setThemeServerFn, type Theme } from "~/lib/theme";
import { cn } from "~/utils/cn";

export const Route = createFileRoute("/_protected/compte/preferences")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const context = Route.useRouteContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenPassword, setIsModalOpenPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(context.user.image ?? undefined);
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: useServerFn(deleteUser),
  });
  const { mutate: update, isPending: isUpdatingUserInfos } = useMutation({
    mutationFn: useServerFn(updateUserInfos),
  });
  const { mutate: updatePassword, isPending: isUpdatingUserPassword } = useMutation({
    mutationFn: useServerFn(updateUserPasswordFn),
  });
  const { mutate: updateEmail, isPending: isUpdatingUserEmail } = useMutation({
    mutationFn: useServerFn(updateUserEmailFn),
  });
  const { mutate: updateAvatarMutation, isPending: isUpdatingAvatar } = useMutation({
    mutationFn: useServerFn(updateUserAvatar),
  });

  useEffect(() => {
    setAvatarPreview(context.user.image ?? undefined);
  }, [context.user.image]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function toggleTheme(theme: Theme) {
    setThemeServerFn({ data: theme }).then(() => router.invalidate());
  }

  function onDelete() {
    mutate({ data: { userId: context.user.id } });
  }

  function onAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(URL.createObjectURL(file));
  }

  function onUpdateUserName(event: SyntheticEvent<HTMLFormElement>) {
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
          toast({
            description: "Nom et prénom modifié avec succès",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  function onUpdateUserPassword(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    updatePassword(
      { data: formData },
      {
        onSuccess: () => {
          setIsModalOpenPassword(false);
          toast({
            description: "Mot de passe modifié avec succès",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  function onUpdateUserEmail(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    updateEmail(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            description: "Email modifié avec succès",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  function onUpdateUserAvatar(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const avatar = formData.get("avatar");

    if (!(avatar instanceof File) || avatar.size === 0) {
      toast({
        status: "error",
        title: "Mise à jour impossible",
        description: "Veuillez sélectionner une image",
        button: { label: "Fermer" },
      });
      return;
    }

    updateAvatarMutation(
      { data: formData },
      {
        onSuccess: async ({ image }) => {
          setAvatarPreview(image);
          await context.queryClient.invalidateQueries({
            queryKey: ["user", "session"],
            refetchType: "all",
          });
          toast({
            description: "Avatar modifié avec succès",
            button: { label: "Fermer" },
          });
        },
        onError: (error) => {
          toast({
            status: "error",
            title: "Mise à jour impossible",
            description: error.message,
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tighter">Préférences utilisateur</h1>
        <p>Modifiez vos préférences utilisateur pour personnaliser votre expérience sur le site.</p>
      </header>

      <Separator className="my-8 h-px bg-border" />

      <div className="grid gap-8">
        <article className="border border-border p-4 rounded-sm">
          <form onSubmit={onUpdateUserAvatar}>
            <div className="flex items-start justify-between gap-6 py-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">Avatar</h2>
                <p className="text-sm text-pretty max-w-prose">
                  Votre avatar est votre image de profil. Formats acceptés : PNG, JPG, JPEG, WEBP.
                  Taille maximale : 2MB.
                </p>
              </div>

              <div className="flex justify-center px-4">
                <InputFile
                  preview={avatarPreview}
                  alt={`Avatar de ${context.user.name}`}
                  name="avatar"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={onAvatarChange}
                  previewClassName="object-cover"
                  overlay={
                    <div className="flex h-full flex-col items-center justify-end bg-linear-to-t from-black/70 via-black/20 to-transparent p-3 text-white opacity-100 transition-opacity md:opacity-0 md:group-hover/input-file:opacity-100 md:group-focus-within/input-file:opacity-100">
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium backdrop-blur-sm">
                        <Camera className="size-3.5" />
                        <span>Changer photo</span>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            <Separator className="my-4 -mx-4 h-px bg-border" />

            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs"
                disabled={isUpdatingAvatar}
              >
                {isUpdatingAvatar ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Modifier mon avatar"
                )}
              </button>
            </div>
          </form>
        </article>

        <article className="border border-border p-4 rounded-sm">
          <form onSubmit={onUpdateUserName}>
            <div className="flex flex-col gap-2 py-4">
              <h2 className="text-xl font-bold">Nom et prénom</h2>
              <p className="text-sm text-pretty mb-4">
                Votre nom et prénom sont utilisés pour identifier votre compte. Vous pouvez le
                modifier en cliquant sur le bouton ci-dessous.
              </p>
              <Label>
                <span className="sr-only">Nom et prénom</span>
                <Input name="name" defaultValue={context.user.name} className="max-w-1/3 text-sm" />
              </Label>
            </div>

            <Separator className="my-4 -mx-4 h-px bg-border" />

            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs"
                disabled={isUpdatingUserInfos}
              >
                {isUpdatingUserInfos ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Modifier mon nom et prénom"
                )}
              </button>
            </div>
          </form>
        </article>

        <article className="border border-border p-4 rounded-sm">
          <form onSubmit={onUpdateUserEmail}>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">Email</h2>
              <p className="text-sm text-pretty mb-4">
                Un email de confirmation vous sera envoyé afin de vérifier votre identité
              </p>
              <Label>
                <span className="sr-only">Email</span>
                <div className="relative">
                  <Mail className="size-4 text-muted-foreground absolute inset-s-2 top-2.5" />
                  <Input
                    name="email"
                    defaultValue={context.user.email}
                    className="max-w-1/3 text-sm ps-8"
                  />
                </div>
              </Label>
            </div>

            <Separator className="my-4 -mx-4 h-px bg-border" />

            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs"
                disabled={isUpdatingUserEmail}
              >
                {isUpdatingUserEmail ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Modifier mon email"
                )}
              </button>
            </div>
          </form>
        </article>

        <article className="border border-border p-4 rounded-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Mot de passe</h2>
            <p className="text-sm text-pretty mb-4">
              Votre mot de passe est utilisé pour accéder à votre compte. Vous pouvez le modifier en
              cliquant sur le bouton ci-dessous.
            </p>
            <Label>
              <span className="sr-only">Mot de passe</span>
              <div className="relative">
                <Lock className="size-4 text-muted-foreground absolute inset-s-2 top-2.5" />
                <Input
                  type="password"
                  name="password"
                  placeholder="**************"
                  className="max-w-1/3 text-sm ps-8"
                />
              </div>
            </Label>
          </div>

          <Separator className="my-4 -mx-4 h-px bg-border" />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs"
              onClick={() => setIsModalOpenPassword(true)}
            >
              Modifier mon mot de passe
            </button>

            <Dialog open={isModalOpenPassword} onOpenChange={setIsModalOpenPassword}>
              <DialogContent className="px-6 py-4">
                <DialogTitle>Modifier mon mot de passe</DialogTitle>

                <Separator className="my-4 -mx-4 h-px bg-border" />

                <DialogDescription className="mb-6 text-sm text-pretty">
                  Veuillez entrer votre mot de passe actuel et votre nouveau mot de passe.
                </DialogDescription>

                <form onSubmit={onUpdateUserPassword}>
                  <div className="flex flex-col gap-4 mb-6">
                    <Label className="flex flex-col gap-2">
                      <span className="text-sm">Mot de passe actuel</span>
                      <Input
                        type="password"
                        name="password"
                        className="text-sm"
                        placeholder="**************"
                      />
                    </Label>

                    <Label className="flex flex-col gap-2">
                      <span className="text-sm">Nouveau mot de passe</span>
                      <Input
                        type="password"
                        name="newPassword"
                        className="text-sm"
                        placeholder="**************"
                      />
                    </Label>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-sm text-xs"
                      onClick={() => setIsModalOpenPassword(false)}
                    >
                      Annuler
                    </button>

                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs"
                      disabled={isUpdatingUserPassword}
                    >
                      {isUpdatingUserPassword ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        "Modifier mon mot de passe"
                      )}
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </article>

        <article className="border border-border p-4 rounded-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Thème</h2>
            <p className="text-sm text-pretty mb-4">
              Vous pouvez modifier le thème du site en selectionnant une option ci-dessous.
            </p>

            <RadioGroup value={context.theme} onValueChange={toggleTheme} className="flex gap-2">
              <RadioGroupItem
                value="light"
                className={cn(
                  "bg-secondary text-secondary-foreground px-3 py-2 rounded-sm text-xs cursor-pointer flex items-center gap-2",
                  context.theme === "light" && "bg-primary text-primary-foreground",
                )}
              >
                <SunIcon className="size-4" />
                Light
              </RadioGroupItem>

              <RadioGroupItem
                value="dark"
                className={cn(
                  "bg-secondary text-secondary-foreground px-3 py-2 rounded-sm text-xs cursor-pointer flex items-center gap-2",
                  context.theme === "dark" && "bg-primary text-primary-foreground",
                )}
              >
                <MoonIcon className="size-4" />
                Dark
              </RadioGroupItem>

              <RadioGroupItem
                value="auto"
                className={cn(
                  "bg-secondary text-secondary-foreground px-3 py-2 rounded-sm text-xs cursor-pointer flex items-center gap-2",
                  context.theme === "auto" && "bg-primary text-primary-foreground",
                )}
              >
                <MonitorIcon className="size-4" />
                System
              </RadioGroupItem>
            </RadioGroup>
          </div>
        </article>
        <Separator className="my-8 h-px bg-border" />

        <article className="border border-destructive rounded-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2 p-4">
            <h2 className="text-lg font-bold">Supprimer mon compte</h2>
            <p className="text-sm text-pretty">
              Supprimer votre compte utilisateur et toutes vos données associées. Cette action est
              irréversible.
            </p>
          </div>

          <div className="flex justify-end p-4 border-t border-destructive">
            <button
              type="button"
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-sm text-xs"
              onClick={() => setIsModalOpen(true)}
            >
              Supprimer mon compte
            </button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="p-4">
                <DialogTitle>Supprimer mon compte</DialogTitle>

                <Separator className="my-4 -mx-4 h-px bg-border" />

                <DialogDescription className="mb-6 text-sm text-pretty">
                  Si vous souhaitez supprimer votre compte, veuillez cliquer sur le bouton
                  ci-dessous. Les entreprises liées à votre compte seront également supprimées et ne
                  seront plus visibles dans l'annuaire.
                </DialogDescription>

                <div className="flex justify-end gap-2 px-2">
                  <button
                    type="button"
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-sm text-xs"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    className="bg-destructive text-destructive-foreground px-4 py-2 rounded-sm text-xs"
                    disabled={isPending}
                    onClick={onDelete}
                  >
                    {isPending ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      "Supprimer mon compte"
                    )}
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
