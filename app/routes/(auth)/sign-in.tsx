import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";
import banner from "~/assets/img/banniere.png?url";
import logo from "~/assets/img/Logo vecto_png.png?url";
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
  .inputValidator(LoginSchema)
  .handler(async ({ data }) => {
    await auth().api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: getRequestHeaders(),
    });

    return { status: "success" as const };
  });

export const Route = createFileRoute("/(auth)/sign-in")({
  head: () => ({
    meta: [{ title: "Sign in" }],
  }),
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/compte/entreprises" });
    }
  },
});

function RouteComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const navigate = Route.useNavigate();
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
        onSuccess: async () => {
          await router.invalidate();
          await navigate({ to: "/compte/entreprises" });
        },
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
    <main className="bg-background text-foreground">
      <section className="pt-16 text-center md:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-10 md:pb-12">
          <img src={logo} alt="Annuaire TIH" className="mb-8 h-32 w-auto md:h-44" />
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Annuaire - TIH</h1>
          <p className="mt-5 text-2xl font-light md:text-4xl">
            Votre réseau de prestataires indépendants TIH*.
          </p>
        </div>

        <img
          src={banner}
          alt="Illustration Annuaire TIH"
          className="h-40 w-full object-cover object-center md:h-72"
        />
      </section>

      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto w-full max-w-3xl bg-primary px-10 py-10 text-primary-foreground md:px-12">
          <div className="mb-10 flex flex-col gap-6 text-center">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight">Bienvenue</h2>
            <p className="text-sm">Connectez-vous pour accéder à votre compte.</p>
          </div>

          <form className="mx-auto flex max-w-2xl flex-col gap-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="h-12 bg-input text-foreground"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="h-12 bg-input pe-10 text-foreground"
                />
                <button
                  type="button"
                  className="absolute end-3 top-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="size-5" aria-hidden="true" />
                  ) : (
                    <EyeOffIcon className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Link className="text-xs underline underline-offset-2" to="/forgot-password">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="mx-auto flex h-14 min-w-72 items-center justify-center gap-2 bg-secondary px-8 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Connexion en cours</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-1 text-sm">
            <p>Pas encore inscrit ?</p>
            <Link className="underline underline-offset-2" to="/sign-up">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
