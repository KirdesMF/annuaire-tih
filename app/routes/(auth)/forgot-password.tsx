import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Loader, Mail } from "lucide-react";
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
            <div className="relative">
              <Mail className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input type="email" name="email" placeholder="exemple@email.com" className="ps-8" />
            </div>
          </Label>

          <button
            type="submit"
            className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors p-2 rounded-sm font-medium text-sm"
            disabled={isPending}
          >
            {isPending ? <Loader className="size-4 animate-spin" /> : "Envoyer"}
          </button>
        </form>
      </div>
    </main>
  );
}
