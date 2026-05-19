import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { CheckIcon, EyeIcon, EyeOffIcon, Lock, Mail } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { acceptCurrentCguFn } from "~/lib/api/cgu/accept-cgu";
import { userCompaniesQuery } from "~/lib/api/users/queries/get-user-companies";
import { authClient } from "~/lib/auth/auth.client";
import {
  PASSWORD_LENGTH_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "~/lib/auth/password-policy";
import { sessionQueryOptions } from "~/lib/auth/session-query";

const SIGNUP_STEPS = [
  { id: "account", label: "Création du compte..." },
  { id: "cgu", label: "Validation des CGU..." },
  { id: "workspace", label: "Préparation de votre espace..." },
] as const;

type SignupStep = (typeof SIGNUP_STEPS)[number]["id"];

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
      v.minLength(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_MESSAGE),
      v.maxLength(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_MESSAGE),
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

export const Route = createFileRoute("/(auth)/sign-up")({
  head: () => ({
    meta: [{ title: "Créer un compte" }],
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
  const navigate = Route.useNavigate();
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  const acceptCurrentCgu = useServerFn(acceptCurrentCguFn);
  const [signupStep, setSignupStep] = useState<SignupStep | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: v.InferOutput<typeof SignupSchema>) => {
      setSignupStep("account");
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Impossible de créer le compte");
      }

      setSignupStep("cgu");

      try {
        await acceptCurrentCgu();
      } catch {
        return { redirectTo: "/accept-cgu" as const };
      }

      setSignupStep("workspace");
      await queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey });
      const session = await queryClient.fetchQuery(sessionQueryOptions);

      if (session?.user.id) {
        await queryClient.ensureQueryData(userCompaniesQuery(session.user.id));
      }

      await router.invalidate();

      return { redirectTo: "/compte/entreprises" as const };
    },
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const decoded = decode(formData, { booleans: ["cgu"] });

    const result = v.safeParse(SignupSchema, decoded, { abortEarly: true });

    if (!result.success) {
      toast({
        description: result.issues[0].message,
        button: { label: "Fermer" },
      });
      return;
    }

    mutate(result.output, {
      onSuccess: async ({ redirectTo }) => {
        await navigate({ to: redirectTo });
      },
      onError: () => {
        setSignupStep(null);
        toast({
          status: "error",
          description:
            "Impossible de créer le compte. Si cette adresse est déjà utilisée, connectez-vous ou réinitialisez votre mot de passe.",
          button: { label: "Fermer" },
        });
      },
    });
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
            <Label className="flex flex-col gap-1" htmlFor="lastName">
              <span>Nom*</span>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Entrez votre nom"
              />
            </Label>

            <Label className="flex flex-col gap-1" htmlFor="firstName">
              <span>Prénom*</span>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="Entrez votre prénom"
              />
            </Label>

            <Label className="flex flex-col gap-1" htmlFor="signup-email">
              <span>Email*</span>
              <div className="relative">
                <Mail
                  className="absolute inset-s-2 top-2.5 size-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="exemple@email.com"
                  className="ps-8"
                />
              </div>
            </Label>

            <Label className="flex flex-col gap-1" htmlFor="signup-password">
              <span>Mot de passe*</span>
              <div className="relative">
                <Lock
                  className="absolute inset-s-2 top-2.5 size-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  placeholder="••••••••••••••••"
                  className="ps-8"
                />
                <button
                  type="button"
                  className="absolute inset-e-2 top-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={
                    showPassword.password ? "Masquer le mot de passe" : "Afficher le mot de passe"
                  }
                  aria-pressed={showPassword.password}
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
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

            <Label className="flex flex-col gap-1" htmlFor="confirmPassword">
              <span>Confirmation du mot de passe*</span>
              <div className="relative">
                <Lock
                  className="absolute inset-s-2 top-2.5 size-4 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  placeholder="••••••••••••••••"
                  className="ps-8"
                />
                <button
                  type="button"
                  className="absolute inset-e-2 top-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={
                    showPassword.confirmPassword
                      ? "Masquer la confirmation du mot de passe"
                      : "Afficher la confirmation du mot de passe"
                  }
                  aria-pressed={showPassword.confirmPassword}
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

            <Label className="flex gap-2 items-center" htmlFor="cgu">
              <input id="cgu" name="cgu" type="checkbox" required className="accent-primary" />
              <span className="text-xs">
                Je reconnais avoir pris connaissance et j'accepte les{" "}
                <Link to="/cgu" className="text-blue-500 underline">
                  conditions générales d'utilisation
                </Link>
                .
              </span>
            </Label>
          </div>

          <div className="grid gap-3">
            <button
              type="submit"
              className="transition-colors px-2 py-3 rounded-sm font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1"
              disabled={isPending}
            >
              {isPending ? "Création de votre espace..." : "S'inscrire"}
            </button>

            {isPending ? <SignupProgress activeStep={signupStep} /> : null}
          </div>
        </form>
      </div>
    </main>
  );
}

function SignupProgress({ activeStep }: { activeStep: SignupStep | null }) {
  const activeIndex = SIGNUP_STEPS.findIndex((step) => step.id === activeStep);

  return (
    <ul className="grid gap-2 text-xs text-muted-foreground" aria-live="polite">
      {SIGNUP_STEPS.map((step, index) => {
        const isDone = activeIndex > index;
        const isActive = activeIndex === index;

        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={[
                "grid size-4 place-items-center rounded-full border transition-colors",
                isDone
                  ? "border-primary bg-primary text-primary-foreground"
                  : isActive
                    ? "border-primary text-primary"
                    : "border-muted-foreground/40 text-transparent",
              ].join(" ")}
              aria-hidden="true"
            >
              <CheckIcon className="size-3" />
            </span>
            <span className={isActive ? "text-foreground" : undefined}>{step.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
