import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { Command } from "cmdk";
import { useState } from "react";
import { CloseIcon } from "~/components/icons/close";
import { categoriesQueryOptions } from "~/lib/api/categories";
import { addCompany } from "~/lib/api/companies";
import { toast } from "sonner";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/add")({
	component: RouteComponent,
	loader: ({ context }) => {
		const categories = context.queryClient.ensureQueryData(categoriesQueryOptions);
		return categories;
	},
});

function RouteComponent() {
	const context = Route.useRouteContext();
	const data = Route.useLoaderData();
	const router = useRouter();
	const { mutate, isPending } = useMutation({ mutationFn: useServerFn(addCompany) });
	const [selectedCategories, setSelectedCategories] = useState(new Set<(typeof data)[number]>());

	function onSelectCategory(category: (typeof data)[number]) {
		setSelectedCategories((prev) => {
			const newSet = new Set(prev);
			newSet.add(category);
			return newSet;
		});
	}

	function onRemoveCategory(category: (typeof data)[number]) {
		setSelectedCategories((prev) => {
			const newSet = new Set(prev);
			newSet.delete(category);
			return newSet;
		});
	}

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		mutate(
			{
				data: {
					name: formData.get("name") as string,
					siret: formData.get("siret") as string,
					description: formData.get("description") as string,
					categories: Array.from(selectedCategories).map((cat) => cat.id),
				},
			},
			{
				onSuccess: () => {
					context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					toast.success("Entreprise créée avec succès");
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

				<Label className="flex flex-col gap-1">
					Description
					<textarea
						name="description"
						className="border rounded-sm p-2 border-gray-300 resize-none"
						rows={4}
					/>
				</Label>

				<Label className="flex flex-col gap-1">
					Catégories (max. 3)
					<Command className="border rounded-sm border-gray-300">
						<Command.Input placeholder="Rechercher une catégorie" className="w-full h-10 px-2" />
						<Command.Separator className="h-px bg-gray-300" />
						<Command.List className="max-h-60 overflow-y-auto">
							{data.map((category) => (
								<Command.Item
									key={category.id}
									value={category.name}
									className="cursor-pointer py-1 px-2 aria-selected:bg-gray-100"
									onSelect={() => onSelectCategory(category)}
								>
									{category.name}
								</Command.Item>
							))}
						</Command.List>
					</Command>
				</Label>

				<ul className="flex flex-wrap gap-2">
					{Array.from(selectedCategories).map((category) => (
						<li
							key={category.id}
							className="bg-gray-100 px-2 py-1 rounded-sm text-xs flex items-center gap-2"
						>
							{category.name}
							<button
								type="button"
								className="text-gray-500 inline-grid place-items-center cursor-pointer"
								onClick={() => onRemoveCategory(category)}
							>
								<CloseIcon className="w-3 h-3" />
							</button>
						</li>
					))}
				</ul>

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
