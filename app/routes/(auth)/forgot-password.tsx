import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { InfoIcon, Loader, Mail } from "lucide-react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { authClient } from "~/lib/auth/auth.client";

const ForgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email("Veuillez entrer une adresse email valide")),
});

export const Route = createFileRoute("/(auth)/forgot-password")({
  head: () => ({
    meta: [{ title: "Mot de passe oublié" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: v.InferOutput<typeof ForgotPasswordSchema>) => {
      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        return null;
      }

      return result.data;
    },
  });

  function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = v.safeParse(ForgotPasswordSchema, Object.fromEntries(formData.entries()));

    if (!result.success) {
      toast({
        status: "error",
        description: result.issues[0].message,
        button: { label: "Fermer" },
      });
      return;
    }

    mutate(result.output, {
      onSuccess: () => {
        toast({
          description:
            "Si un compte existe pour cette adresse, un email de réinitialisation sera envoyé.",
          button: { label: "Fermer" },
        });
      },
      onError: () => {
        toast({
          description:
            "Si un compte existe pour cette adresse, un email de réinitialisation sera envoyé.",
          button: { label: "Fermer" },
        });
      },
    });
  }

  return (
    <main>
      <div className="max-w-lg mx-auto px-4 py-12 min-h-svh">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter">Mot de passe oublié</h1>

        <div
          className="border border-blue-500 bg-blue-100 rounded-sm px-2 py-4 text-blue-500 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-400 mb-6"
          role="note"
        >
          <div className="flex gap-2">
            <InfoIcon className="size-4 shrink-0" aria-hidden />
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
          <Label className="flex flex-col gap-2" htmlFor="forgot-email">
            Email *
            <div className="relative">
              <Mail
                className="size-4 text-muted-foreground absolute inline-s-2 top-2.5"
                aria-hidden
              />
              <Input
                id="forgot-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="exemple@email.com"
                className="ps-8"
              />
            </div>
          </Label>

          <button
            type="submit"
            className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors p-2 rounded-sm font-medium text-sm inline-flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" aria-hidden />
                <span className="sr-only">Envoi en cours</span>
              </>
            ) : (
              "Envoyer"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
