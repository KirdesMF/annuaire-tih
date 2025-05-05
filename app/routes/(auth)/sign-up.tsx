import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth/api";
import { decode } from "decode-formdata";
import { EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Resend } from "resend";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { getDb } from "~/db";
import { userCguAcceptanceTable } from "~/db/schema/cgu";
import { auth } from "~/lib/auth/auth.server";

const SignupSchema = v.pipe(
  v.object({
    lastName: v.pipe(
      v.string(),
      v.nonEmpty("Veuillez entrer votre nom"),
      v.maxLength(100, "Le nom doit contenir au plus 100 caractères"),
    ),
    firstName: v.pipe(
      v.string(),
      v.nonEmpty("Veuillez entrer votre prénom"),
      v.maxLength(100, "Le prénom doit contenir au plus 100 caractères"),
    ),
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
    confirmPassword: v.pipe(v.string(), v.minLength(1, "Veuillez confirmer votre mot de passe")),
    cgu: v.boolean("Veuillez accepter les conditions générales d'utilisation"),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      ({ password, confirmPassword }) => password === confirmPassword,
      "Les mots de passe ne correspondent pas",
    ),
    ["confirmPassword"],
  ),
);

export const signupFn = createServerFn()
  .validator(SignupSchema)
  .handler(async ({ data }) => {
    try {
      const res = await auth().api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
        },
      });

      // update user cgu acceptance
      const db = getDb();
      const activeCGU = await db.query.cguTable.findFirst({
        where: (cgu, { eq }) => eq(cgu.isActive, true),
      });

      if (!activeCGU) {
        throw new Error("No active CGU found");
      }

      await db.insert(userCguAcceptanceTable).values({
        userId: res.user.id,
        cguId: activeCGU.id,
        acceptedAt: new Date(),
      });
    } catch (error) {
      if (error instanceof APIError) {
        return { status: "error", message: error.message };
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: emailData, error } = await resend.emails.send({
      from: "noreply@annuaire-tih.fr",
      to: data.email,
      subject: "Bienvenue sur l'annuaire Tih",
      react: (
        <div>
          <h1>Bienvenue sur l'annuaire Tih</h1>
          <p>Votre compte a été créé avec succès</p>
        </div>
      ),
    });

    if (error) {
      console.error(error);
    }

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
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: useServerFn(signupFn),
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const decoded = decode(formData, { booleans: ["cgu"] });

    const result = v.safeParse(SignupSchema, decoded, { abortEarly: true });

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
      <div className="max-w-md w-full mx-auto border border-border bg-card text-card-foreground px-8 py-12 rounded-sm shadow-xs">
        <div className="flex flex-col gap-2 mb-8">
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
              <div className="relative">
                <Mail className="absolute start-2 top-2.5 size-4 text-muted-foreground" />
                <Input name="email" type="email" placeholder="exemple@email.com" className="ps-8" />
              </div>
            </Label>

            <Label className="flex flex-col gap-1">
              <span>Mot de passe*</span>
              <div className="relative">
                <Lock className="absolute start-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="ps-8"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute end-2 top-2.5"
                  onClick={() =>
                    setShowPassword({ ...showPassword, password: !showPassword.password })
                  }
                >
                  {showPassword.password ? (
                    <EyeIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <EyeOffIcon className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </Label>

            <Label className="flex flex-col gap-1">
              <span>Confirmation du mot de passe*</span>
              <div className="relative">
                <Lock className="absolute start-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="ps-8"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute end-2 top-2.5"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                >
                  {showPassword.confirmPassword ? (
                    <EyeIcon className="size-4 text-muted-foreground" />
                  ) : (
                    <EyeOffIcon className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </Label>

            <Label className="flex gap-2 items-center">
              <input name="cgu" type="checkbox" className="accent-primary" />
              <span className="text-xs">
                Je reconnais avoir pris connaissance et j'accepte les{" "}
                <Link to="/cgu" className="text-blue-500 underline">
                  conditions générales d'utilisation
                </Link>
                .
              </span>
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
