import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import * as v from "valibot";
import { ChevronRightIcon } from "~/components/icons/chevron-right";
import { EmailIcon } from "~/components/icons/email";
import { LockIcon } from "~/components/icons/lock";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
      toast.error(result.issues[0].message);
      return;
    }

    mutate({ data: result.output });
  }

  return (
    <main className="min-h-[calc(100dvh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 px-8 py-12 rounded-md shadow-xs">
        <div className="flex flex-col gap-2 mb-12">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-sm text-center">Connectez-vous pour accéder à votre compte.</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email *</Label>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-sm px-2 focus-within:outline focus-within:outline-blue-500">
              <EmailIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="border-none outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Mot de passe *</Label>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-sm px-2 focus-within:outline focus-within:outline-blue-500">
              <LockIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <Input
                type="password"
                name="password"
                placeholder="••••••••••••••••"
                className="border-none outline-none"
              />
            </div>

            <div className="flex justify-end mt-1">
              <Link className="text-xs text-blue-500" to="/forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="transition-colors px-2 py-3 rounded-sm font-medium text-sm bg-blue-700 text-white hover:bg-blue-800 flex items-center justify-center gap-1"
            disabled={isPending}
          >
            {isPending ? (
              "Connection en cours..."
            ) : (
              <div className="flex items-center justify-center gap-2 w-full">
                <span>Se connecter</span>
                <ChevronRightIcon className="size-5" />
              </div>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 mt-6">
          <p className="text-sm">Pas encore inscrit ?</p>
          <Link className="text-sm text-blue-500" to="/sign-up">
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
