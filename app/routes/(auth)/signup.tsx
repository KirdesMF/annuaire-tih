import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth/api";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import * as v from "valibot";
import { Resend } from "resend";
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

type SignupData = v.InferOutput<typeof SignupSchema>;

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

export const Route = createFileRoute("/(auth)/signup")({
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
		mutate({
			data: {
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				firstName: formData.get("firstName") as string,
				lastName: formData.get("lastName") as string,
			},
		});
	}

	return (
		<main className="py-12">
			<h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>

			<div className="max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm">
				<form className="flex flex-col gap-6" onSubmit={onSubmit}>
					<div className="grid gap-4">
						<Label className="flex flex-col gap-1">
							<span>Nom*</span>
							<Input name="lastName" type="text" required />
						</Label>

						<Label className="flex flex-col gap-1">
							<span>Prénom*</span>
							<Input name="firstName" type="text" required />
						</Label>

						<Label className="flex flex-col gap-1">
							<span>Email*</span>
							<Input name="email" type="email" required />
						</Label>

						<Label className="flex flex-col gap-1">
							<span>Mot de passe*</span>
							<Input name="password" type="password" required />
						</Label>

						<Label className="flex flex-col gap-1">
							<span>Confirmation du mot de passe*</span>
							<Input name="confirmPassword" type="password" required />
						</Label>
					</div>

					<button
						type="submit"
						className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm"
						disabled={isPending}
					>
						{isPending ? "Création en cours..." : "S'inscrire"}
					</button>
				</form>
			</div>
		</main>
	);
}
