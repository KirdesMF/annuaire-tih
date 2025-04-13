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
import { ChevronDownIcon } from "~/components/icons/chevron-down";

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
	const [selectedCategories, setSelectedCategories] = useState(new Set<string>());

	function onSelectCategory(categoryId: string) {
		setSelectedCategories((prev) => {
			if (prev.size >= 3) {
				toast.error("Vous ne pouvez pas sélectionner plus de 3 catégories");
				return prev;
			}
			return new Set(prev).add(categoryId);
		});
	}

	function onRemoveCategory(categoryId: string) {
		setSelectedCategories((prev) => {
			const newSet = new Set(prev);
			newSet.delete(categoryId);
			return newSet;
		});
	}

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		for (const category of selectedCategories) {
			formData.append("categories", category);
		}

		const result = v.safeParse(AddCompanySchema, {
			name: formData.get("name"),
			siret: formData.get("siret"),
			description: formData.get("description"),
			categories: formData.getAll("categories"),
			logo: formData.get("logo"),
		});

		if (!result.success) {
			toast.error(result.issues.map((issue) => issue.message).join(","));
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
				<h1 className="text-2xl font-bold mb-4">Référencez votre entreprise</h1>

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
						<span className="mb-1 block">Catégories * (max. 3)</span>
						<Popover.Root>
							<Popover.Trigger className="h-9 cursor-pointer border rounded-sm border-gray-300 px-2 py-1 text-xs flex items-center justify-between gap-2">
								<span className="rounded-sm text-xs flex items-center gap-2">
									Ajouter une catégorie
								</span>
								<ChevronDownIcon className="size-5 text-gray-500" />
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content
									className="bg-white w-(--radix-popper-anchor-width)"
									sideOffset={5}
								>
									<Command className="border rounded-sm border-gray-300">
										<Command.Input
											placeholder="Rechercher une catégorie"
											className="w-full h-10 px-2 outline-none placeholder:text-sm placeholder:font-light"
										/>
										<Command.Separator className="h-px bg-gray-300" />
										<Command.List className="max-h-60 overflow-y-auto">
											{data.map((category) => (
												<Command.Item
													key={category.id}
													value={category.name}
													disabled={selectedCategories.has(category.id)}
													className="cursor-pointer py-1.5 px-2 aria-selected:bg-gray-100 text-sm font-light aria-disabled:opacity-20"
													onSelect={() => onSelectCategory(category.id)}
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
						{Array.from(selectedCategories).map((categoryId) => {
							const category = data.find((c) => c.id === categoryId);
							if (!category) return null;

							return (
								<li
									key={category.id}
									className="bg-gray-400 text-white px-2 py-1 rounded-sm text-xs flex items-center gap-2"
								>
									<span className="max-w-[30ch] truncate">{category.name}</span>
									<button
										type="button"
										className="text-white inline-grid place-items-center cursor-pointer"
										onClick={() => onRemoveCategory(category.id)}
									>
										<CloseIcon className="size-3 text-white" />
									</button>
								</li>
							);
						})}
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
