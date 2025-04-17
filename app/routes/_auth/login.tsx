import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { authClient } from "~/lib/auth/auth.client";
import * as v from "valibot";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { auth } from "~/lib/auth/auth.server";

const LoginSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8)),
});

type LoginData = v.InferOutput<typeof LoginSchema>;

export const loginFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => v.parse(LoginSchema, data))
	.handler(async ({ data }) => {
		await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
			},
		});
	});

export const Route = createFileRoute("/_auth/login")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/compte/entreprises" });
		}
	},
});

function RouteComponent() {
	const router = useRouter();
	const { mutate, isPending } = useMutation({
		mutationFn: useServerFn(loginFn),
	});

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		mutate(
			{
				data: {
					email: formData.get("email") as string,
					password: formData.get("password") as string,
				},
			},
			{
				onSuccess: async () => {
					router.navigate({ to: "/compte/entreprises" });
				},
			},
		);
	}

	return (
		<main className="py-12">
			<h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

			<div className="max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm">
				<form className="flex flex-col gap-6" onSubmit={onSubmit}>
					<Label>
						Email *
						<Input type="email" name="email" placeholder="Email" />
					</Label>

					<Label>
						Password *
						<Input type="password" name="password" placeholder="Password" />
					</Label>

					<button
						type="submit"
						className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm"
						disabled={isPending}
					>
						{isPending ? "Connexion en cours..." : "Connexion"}
					</button>
				</form>
			</div>
		</main>
	);
}
