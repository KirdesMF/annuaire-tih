import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth/api";
import { Resend } from "resend";
import { toast } from "sonner";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { auth } from "~/lib/auth/auth.server";

const SignupSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Veuillez entrer votre email"),
    v.email("Veuillez entrer un email valide"),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Le mot de passe doit contenir au moins 8 caractères"),
    v.maxLength(100, "Le mot de passe doit contenir au plus 100 caractères"),
  ),
  firstName: v.pipe(
    v.string(),
    v.nonEmpty("Veuillez entrer votre prénom"),
    v.maxLength(100, "Le prénom doit contenir au plus 100 caractères"),
  ),
  lastName: v.pipe(
    v.string(),
    v.nonEmpty("Veuillez entrer votre nom"),
    v.maxLength(100, "Le nom doit contenir au plus 100 caractères"),
  ),
});

export const signupFn = createServerFn()
  .validator((data: unknown) => v.parse(SignupSchema, data))
  .handler(async ({ data }) => {
    try {
      await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
        },
      });
    } catch (error) {
      if (error instanceof APIError) {
        return { status: "error", message: error.message };
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: emailData, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "cedgourville@gmail.com",
      subject: "Bienvenue sur l'application de gestion de projet",
      react: (
        <div>
          <h1>Bienvenue sur l'application de gestion de projet</h1>
          <p>Votre compte a été créé avec succès</p>
        </div>
      ),
    });

    if (error) {
      console.error(error);
    }

    console.log(emailData);

    throw redirect({ to: "/compte/entreprises" });
  });

export const Route = createFileRoute("/(auth)/sign-up")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/compte/entreprises" });
    }
  },
});

function RouteComponent() {
  const { mutate, isPending } = useMutation({
    mutationFn: useServerFn(signupFn),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const result = v.safeParse(
      SignupSchema,
      {
        email: formData.get("email"),
        password: formData.get("password"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      },
      { abortEarly: true },
    );

    if (!result.success) {
      toast.error(result.issues[0].message);
      return;
    }

    mutate({ data: result.output });
  }

  return (
    <main className="min-h-[calc(100dvh-60px)] flex items-center justify-center px-4">
      <div className="max-w-lg w-full mx-auto border border-border bg-card text-card-foreground px-8 py-12 rounded-sm shadow-xs">
        <div className="flex flex-col gap-2 mb-12">
          <h1 className="text-2xl font-bold text-center">Créer un compte</h1>
          <p className="text-sm text-center">
            Un compte vous permet de référencer votre entreprise
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="grid gap-4">
            <Label className="flex flex-col gap-1">
              <span>Nom*</span>
              <Input name="lastName" type="text" placeholder="Entrez votre nom" />
            </Label>

            <Label className="flex flex-col gap-1">
              <span>Prénom*</span>
              <Input name="firstName" type="text" placeholder="Entrez votre prénom" />
            </Label>

            <Label className="flex flex-col gap-1">
              <span>Email*</span>
              <Input name="email" type="email" placeholder="exemple@email.com" />
            </Label>

            <Label className="flex flex-col gap-1">
              <span>Mot de passe*</span>
              <Input name="password" type="password" placeholder="••••••••••••••••" />
            </Label>

            <Label className="flex flex-col gap-1">
              <span>Confirmation du mot de passe*</span>
              <Input name="confirmPassword" type="password" placeholder="••••••••••••••••" />
            </Label>
          </div>

          <button
            type="submit"
            className="transition-colors px-2 py-3 rounded-sm font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1"
            disabled={isPending}
          >
            {isPending ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </main>
  );
}
