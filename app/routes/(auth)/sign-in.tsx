import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { EyeIcon, EyeOffIcon, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState } from "react";
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
    await auth().api.signInEmail({
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
  const [showPassword, setShowPassword] = useState(false);
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
        status: "error",
        description: result.issues[0].message,
      });
      return;
    }

    mutate(
      { data: result.output },
      {
        onError: () => {
          toast({
            status: "error",
            description: "Email ou mot de passe incorrect",
          });
        },
      },
    );
  }

  return (
    <main className="min-h-[calc(100dvh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto border border-border bg-card text-card-foreground px-8 py-10 rounded-md shadow-xs">
        <div className="flex items-center justify-center mb-6">
          <div className="shadow-xs p-2 rounded-sm bg-card text-primary">
            <LogIn className="size-8" aria-hidden />
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-2xl font-bold text-center">Bienvenue</h1>
          <p className="text-sm text-center">Connectez-vous pour accéder à votre compte.</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="email@example.com"
                className="ps-8"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Mot de passe *</Label>
            <div className="relative">
              <LockKeyhole className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••••••••••"
                className="ps-8"
              />
              <button
                type="button"
                className="absolute end-2 top-2.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="size-4 text-muted-foreground" />
                ) : (
                  <EyeOffIcon className="size-4 text-muted-foreground" />
                )}
              </button>
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
              <span>Se connecter</span>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 mt-3">
          <p className="text-sm">Pas encore inscrit ?</p>
          <Link className="text-sm text-muted-foreground" to="/sign-up">
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
