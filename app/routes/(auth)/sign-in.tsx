import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { ChevronRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { auth } from "~/lib/auth/auth.server";

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Veuillez entrer un email"),
    v.email("Veuillez entrer un email valide"),
  ),
  password: v.pipe(v.string(), v.nonEmpty("Veuillez entrer un mot de passe")),
});

export const loginFn = createServerFn({ method: "POST" })
  .validator(LoginSchema)
  .handler(async ({ data }) => {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    throw redirect({ to: "/compte/entreprises" });
  });

export const Route = createFileRoute("/(auth)/sign-in")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/compte/entreprises" });
    }
  },
});

function RouteComponent() {
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: useServerFn(loginFn),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = v.safeParse(LoginSchema, { email, password }, { abortEarly: true });

    if (!result.success) {
      toast({
        description: result.issues[0].message,
        button: { label: "Fermer" },
      });
      return;
    }

    mutate({ data: result.output });
  }

  return (
    <main className="min-h-[calc(100dvh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg mx-auto border border-border bg-card text-card-foreground px-8 py-12 rounded-sm shadow-xs">
        <div className="flex flex-col gap-2 mb-12">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-sm text-center">Connectez-vous pour accéder à votre compte.</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email *</Label>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center size-9 rounded-sm border border-border">
                <Mail className="size-4 text-accent" />
              </div>
              <Input type="email" name="email" id="email" placeholder="email@example.com" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Mot de passe *</Label>
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center size-9 rounded-sm border border-border">
                <LockKeyhole className="size-4 text-accent" />
              </div>
              <Input type="password" name="password" id="password" placeholder="••••••••••••••••" />
            </div>

            <div className="flex justify-end mt-1">
              <Link className="text-xs text-muted-foreground" to="/forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="transition-colors px-2 py-3 rounded-sm font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2 w-full">
                <span>Se connecter</span>
                <ChevronRight className="size-5" />
              </div>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 mt-6">
          <p className="text-sm">Pas encore inscrit ?</p>
          <Link className="text-sm text-muted-foreground" to="/sign-up">
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
