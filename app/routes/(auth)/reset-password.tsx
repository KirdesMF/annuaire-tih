import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { EyeIcon, EyeOffIcon, Loader, Lock } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import {
  PASSWORD_LENGTH_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "~/lib/auth/password-policy";

const SearchParamsSchema = v.object({
  token: v.string(),
});

const ResetPasswordSchema = v.object({
  token: v.string(),
  newPassword: v.pipe(
    v.string(),
    v.minLength(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_MESSAGE),
    v.maxLength(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_MESSAGE),
  ),
});

const resetPasswordClient = createClientOnlyFn(
  async (data: { token: string; newPassword: string }) => {
    const { authClient } = await import("~/lib/auth/auth.client");
    return authClient.resetPassword(data);
  },
);

export const Route = createFileRoute("/(auth)/reset-password")({
  head: () => ({
    meta: [{ title: "Réinitialiser votre mot de passe" }],
  }),
  validateSearch: (search) => v.parse(SearchParamsSchema, search),
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: v.InferOutput<typeof ResetPasswordSchema>) => {
      const result = await resetPasswordClient({
        token: data.token,
        newPassword: data.newPassword,
      });

      if (result.error) {
        throw new Error("Impossible de réinitialiser le mot de passe");
      }

      return result.data;
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = v.safeParse(ResetPasswordSchema, Object.fromEntries(formData.entries()));

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
          description: "Mot de passe réinitialisé avec succès",
          button: { label: "Fermer" },
        });
        navigate({ to: "/sign-in" });
      },
      onError: (error) => {
        toast({
          description: error.message,
          button: { label: "Fermer" },
        });
      },
    });
  }
  return (
    <main>
      <div className="max-w-lg mx-auto px-4 py-12 min-h-svh">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter">Réinitialiser le mot de passe</h1>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <input type="hidden" name="token" value={searchParams.token} />
          <Label className="flex flex-col gap-2" htmlFor="newPassword">
            <span>Nouveau mot de passe *</span>
            <div className="relative">
              <Lock className="size-4 text-muted-foreground absolute start-2 top-2.5" aria-hidden />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                autoComplete="new-password"
                required
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
                placeholder="••••••••••••••••"
                className="ps-8"
              />
              <button
                type="button"
                className="absolute end-2 top-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="size-4 text-muted-foreground" />
                ) : (
                  <EyeOffIcon className="size-4 text-muted-foreground" />
                )}
              </button>
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
                <span className="sr-only">Réinitialisation en cours</span>
              </>
            ) : (
              "Réinitialiser"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
