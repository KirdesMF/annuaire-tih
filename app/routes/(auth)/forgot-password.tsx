import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { InfoIcon, Loader, Mail } from "lucide-react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { auth } from "~/lib/auth/auth.server";

const ForgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email("Veuillez entrer une adresse email valide")),
});

export const forgotPasswordFn = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const formObject = Object.fromEntries(data.entries());
    return v.parse(ForgotPasswordSchema, formObject);
  })
  .handler(async ({ data }) => {
    await auth().api.forgetPassword({
      body: { email: data.email, redirectTo: "/reset-password" },
      headers: getWebRequest()?.headers,
    });
  });

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(forgotPasswordFn) });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            description: "Un email vous a été envoyé pour réinitialiser votre mot de passe",
            button: { label: "Fermer" },
          });
        },
        onError: (error) => {
          toast({
            description: error.message,
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  return (
    <main>
      <div className="max-w-lg mx-auto px-4 py-12 min-h-svh">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter">Mot de passe oublié</h1>

        <div className="border border-blue-500 bg-blue-100 rounded-sm px-2 py-4 text-blue-500 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-400 mb-6">
          <div className="flex gap-2">
            <InfoIcon className="size-4 shrink-0" />
            <div className="flex flex-col gap-2">
              <p className="text-xs text-pretty">
                Si vous avez oublié votre mot de passe, veuillez entrer votre adresse email
                ci-dessous. Un email vous sera envoyé avec les instructions pour réinitialiser votre
                mot de passe.
              </p>
              <p className="text-xs mt-2 text-balance">
                Si vous n'avez pas reçu d'email, veuillez vérifier vos spam ou réessayer.
              </p>
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <Label className="flex flex-col gap-2">
            Email *
            <div className="relative">
              <Mail className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input type="email" name="email" placeholder="exemple@email.com" className="ps-8" />
            </div>
          </Label>

          <button
            type="submit"
            className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors p-2 rounded-sm font-medium text-sm inline-flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? <Loader className="size-4 animate-spin" /> : "Envoyer"}
          </button>
        </form>
      </div>
    </main>
  );
}
