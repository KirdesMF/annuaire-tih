import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { EyeIcon, EyeOffIcon, Loader, Lock } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { auth } from "~/lib/auth/auth.server";

const SearchParamsSchema = v.object({
  token: v.string(),
});

const ResetPasswordSchema = v.object({
  token: v.string(),
  newPassword: v.string(),
});

const resetPasswordFn = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const formObject = Object.fromEntries(data.entries());
    return v.parse(ResetPasswordSchema, formObject);
  })
  .handler(async ({ data }) => {
    await auth().api.resetPassword({
      body: { token: data.token, newPassword: data.newPassword },
    });
  });

export const Route = createFileRoute("/(auth)/reset-password")({
  validateSearch: (search) => v.parse(SearchParamsSchema, search),
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(resetPasswordFn) });
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    mutate(
      { data: formData },
      {
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
      },
    );
  }
  return (
    <main>
      <div className="max-w-lg mx-auto px-4 py-12 min-h-svh">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter">Réinitialiser le mot de passe</h1>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <input type="hidden" name="token" value={searchParams.token} />
          <Label className="flex flex-col gap-2">
            <span>Nouveau mot de passe *</span>
            <div className="relative">
              <Lock className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type={showPassword ? "text" : "password"}
                name="newPassword"
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
          </Label>

          <button
            type="submit"
            className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors p-2 rounded-sm font-medium text-sm inline-flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? <Loader className="size-4 animate-spin" /> : "Réinitialiser"}
          </button>
        </form>
      </div>
    </main>
  );
}
