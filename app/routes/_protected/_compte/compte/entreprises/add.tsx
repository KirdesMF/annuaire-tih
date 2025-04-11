import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { auth } from "~/lib/auth";
import * as v from "valibot";

const AddCompanySchema = v.object({
	name: v.pipe(
		v.string(),
		v.nonEmpty("Veuillez entrer le nom de l'entreprise"),
		v.maxLength(255, "Le nom de l'entreprise doit contenir au plus 255 caractères"),
	),
	siret: v.pipe(
		v.string(),
		v.nonEmpty("Veuillez entrer le siret de l'entreprise"),
		v.maxLength(14, "Le siret de l'entreprise doit contenir 14 caractères"),
	),
});

type AddCompanyData = v.InferOutput<typeof AddCompanySchema>;

export const addCompany = createServerFn({ method: "POST" })
	.validator((data: unknown) => v.parse(AddCompanySchema, data))
	.handler(async ({ data }) => {
		const request = getWebRequest();

		if (!request) return;

		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			throw redirect({ to: "/login" });
		}
		try {
			const { name, siret } = data;

			await db.insert(companiesTable).values({
				name,
				siret,
				user_id: session.user.id,
				created_by: session.user.id,
			});
		} catch (error) {
			console.error(error);
		}
	});

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/add")({
	component: RouteComponent,
});

function RouteComponent() {
	const context = Route.useRouteContext();
	const router = useRouter();
	const { mutate, isPending } = useMutation({ mutationFn: addCompany });

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		mutate(
			{
				data: {
					name: formData.get("name") as string,
					siret: formData.get("siret") as string,
				},
			},
			{
				onSuccess: () => {
					context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					router.navigate({ to: "/compte/entreprises" });
				},
			},
		);
	}

	return (
		<div className="container px-4 py-6">
			<form className="flex flex-col gap-3" onSubmit={onSubmit}>
				<Label>
					Nom de l'entreprise *
					<Input type="text" name="name" />
				</Label>

				<Label>
					Siret *
					<Input type="text" name="siret" />
				</Label>

				<button
					type="submit"
					className="bg-gray-800 text-white p-3 rounded-sm font-light text-sm"
					disabled={isPending}
				>
					{isPending ? "Création en cours..." : "Créer un compte"}
				</button>
			</form>
		</div>
	);
}
