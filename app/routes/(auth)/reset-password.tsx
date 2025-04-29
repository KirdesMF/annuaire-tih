import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import * as v from "valibot";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
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
    await auth.api.resetPassword({
      body: { token: data.token, newPassword: data.newPassword },
    });
  });

export const Route = createFileRoute("/(auth)/reset-password")({
  validateSearch: (search) => v.parse(SearchParamsSchema, search),
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(resetPasswordFn) });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast.success("Mot de passe réinitialisé avec succès");
          navigate({ to: "/sign-in" });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }
  return (
    <main>
      <div className="container px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Réinitialiser le mot de passe</h1>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <input type="hidden" name="token" value={searchParams.token} />
          <Label>
            Nouveau mot de passe *
            <Input type="password" name="newPassword" placeholder="Mot de passe" />
          </Label>

          <button
            type="submit"
            className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm"
            disabled={isPending}
          >
            {isPending ? "Réinitialisation en cours..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </main>
  );
}
