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
import { Popover } from "radix-ui";
import * as v from "valibot";
import { AddCompanySchema } from "~/lib/schemas/company";

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
		for (const category of selectedCategories) {
			formData.append("categories[]", category.id);
		}

		const result = v.safeParse(AddCompanySchema, formData);

		if (!result.success) {
			toast.error(result.issues[0].message);
			return;
		}

		mutate(
			{ data: formData },
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
			<div className="max-w-xl mx-auto">
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
						<span className="mb-1 block">Catégories (max. 3)</span>
						<Popover.Root>
							<Popover.Trigger className="border rounded-sm border-gray-300 px-2 py-1 text-xs flex items-center gap-2">
								<span className="px-2 py-1 rounded-sm text-xs flex items-center gap-2">
									Ajouter une catégorie
								</span>
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content
									className="bg-white w-(--radix-popper-anchor-width)"
									sideOffset={5}
								>
									<Command className="border rounded-sm border-gray-300">
										<Command.Input
											placeholder="Rechercher une catégorie"
											className="w-full h-10 px-2 outline-none"
										/>
										<Command.Separator className="h-px bg-gray-300" />
										<Command.List className="max-h-60 overflow-y-auto">
											{data.map((category) => (
												<Command.Item
													key={category.id}
													value={category.name}
													className="cursor-pointer py-1.5 px-2 aria-selected:bg-gray-100 text-sm font-light"
													onSelect={() => onSelectCategory(category)}
												>
													{category.name}
												</Command.Item>
											))}
										</Command.List>
									</Command>
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
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

					<Label>
						<span className="mb-1 block">Logo</span>
						<input
							type="file"
							name="logo"
							className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 outline-none file:bg-gray-500 file:text-white file:border-0 file:me-4 file:py-2 file:px-4"
						/>
					</Label>

					<fieldset className="flex flex-col gap-2 border border-gray-300 rounded-sm p-2">
						<legend className="text-xs font-medium">Images</legend>
						<Label>
							<span className="mb-1 block">Image 1</span>
							<input
								type="file"
								name="image-1"
								id="image-1"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 outline-none file:bg-gray-500 file:text-white file:border-0 file:me-4 file:py-2 file:px-4"
							/>
						</Label>

						<Label>
							<span className="mb-1 block">Image 2</span>
							<input
								type="file"
								name="image-2"
								id="image-2"
								className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 outline-none file:bg-gray-500 file:text-white file:border-0 file:me-4 file:py-2 file:px-4"
							/>
						</Label>
					</fieldset>

					<button
						type="submit"
						className="bg-gray-800 text-white p-3 rounded-sm font-light text-sm"
						disabled={isPending}
					>
						{isPending ? "Création en cours..." : "Créer un compte"}
					</button>
				</form>
			</div>
		</div>
	);
}
