import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/_auth/login")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session?.user) {
			throw redirect({ to: "/compte/entreprises" });
		}
	},
});

function RouteComponent() {
	const context = Route.useRouteContext();
	const router = useRouter();
	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) =>
			await authClient.signIn.email({
				email,
				password,
			}),
	});

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		mutate(
			{
				email: formData.get("email") as string,
				password: formData.get("password") as string,
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
