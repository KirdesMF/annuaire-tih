import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { db } from "~/db";
import { type NewUser, usersTable } from "~/db/schema/users";
import { getSupabaseServerClient } from "~/utils/supabase";

export const signupFn = createServerFn()
	.validator(
		(d: unknown) => d as { email: string; password: string; firstName: string; lastName: string },
	)
	.handler(async ({ data }) => {
		const supabase = getSupabaseServerClient();

		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
			options: {
				emailRedirectTo: "http://localhost:3000/api/confirm",
			},
		});

		if (error) {
			console.error(error);
			return { status: "error", message: error.message };
		}

		const newUser: NewUser = {
			email: data.email,
			first_name: data.firstName,
			last_name: data.lastName,
		};

		const [user] = await db.insert(usersTable).values(newUser).returning();

		if (!user) {
			return { status: "error", message: "Failed to create user" };
		}

		return { status: "success", message: "User created successfully" };
	});

export const Route = createFileRoute("/_auth/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutate, isPending } = useMutation({
		mutationFn: useServerFn(signupFn),
	});

	return (
		<main className="py-12">
			<form
				onSubmit={(e) => {
					e.preventDefault;
					const formData = new FormData(e.target as HTMLFormElement);
					mutate({
						data: {
							email: formData.get("email") as string,
							password: formData.get("password") as string,
							firstName: formData.get("firstName") as string,
							lastName: formData.get("lastName") as string,
						},
					});
				}}
				className="flex flex-col gap-6 max-w-xl mx-auto"
			>
				<fieldset>
					<legend className="font-light">Informations personnelles</legend>

					<div className="grid gap-4 mt-6">
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
				</fieldset>

				<button
					type="submit"
					className="bg-gray-800 text-white p-3 rounded-sm font-light text-sm"
					disabled={isPending}
				>
					{isPending ? "Création en cours..." : "Créer un compte"}
				</button>
			</form>
		</main>
	);
}
