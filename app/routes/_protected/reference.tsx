import { createFileRoute } from "@tanstack/react-router";
import { Input } from "~/components/input";
import { Label } from "~/components/label";

export const Route = createFileRoute("/_protected/reference")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<form action="">
				<fieldset>
					<legend className="font-light">Informations de l'entreprise</legend>

					<div className="grid gap-4 mt-6">
						<Label className="flex flex-col gap-1">
							<span>Entreprise*</span>
							<Input name="company" type="text" required />
						</Label>
						<Label className="flex flex-col gap-1">
							<span>Site web</span>
							<Input name="website" type="url" />
						</Label>
						<Label className="flex flex-col gap-1">
							<span>Localisation</span>
							<Input name="location" type="text" />
						</Label>
						<Label className="flex flex-col gap-1">
							<span>Sous-domaine</span>
							<Input name="subdomain" type="text" />
						</Label>
						<Label className="flex flex-col gap-1">
							<span>Description</span>
							<textarea
								name="description"
								className="border rounded-sm p-2 border-gray-300 resize-none"
								rows={4}
							/>
						</Label>
					</div>
				</fieldset>
			</form>
		</main>
	);
}
