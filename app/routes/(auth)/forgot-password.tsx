import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
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
    await auth.api.forgetPassword({
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
      <div className="container px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Mot de passe oublié</h1>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <Label className="flex flex-col gap-2">
            Email *
            <Input type="email" name="email" placeholder="Email" />
          </Label>

          <button
            type="submit"
            className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm"
            disabled={isPending}
          >
            {isPending ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </main>
  );
}
