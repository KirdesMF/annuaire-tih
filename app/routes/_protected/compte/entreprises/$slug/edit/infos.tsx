import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { Command } from "cmdk";
import { useRef, useState } from "react";
import { CloseIcon } from "~/components/icons/close";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { toast } from "sonner";
import { Popover, Separator } from "radix-ui";
import { ChevronDownIcon } from "~/components/icons/chevron-down";
import { decode } from "decode-formdata";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { InstagramIcon } from "~/components/icons/instagram";
import { CalendlyIcon } from "~/components/icons/calendly";
import { FacebookIcon } from "~/components/icons/facebook";
import { PhoneIcon } from "~/components/icons/phone";
import { GlobeIcon } from "~/components/icons/globe";
import { EmailIcon } from "~/components/icons/email";
import { useUpdatePreviewStore } from "~/lib/store/preview.store";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { updateCompanyInfos } from "~/lib/api/companies/mutations/update-company";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit/infos")({
	loader: async ({ context, params }) => {
		// seed the cache
		await Promise.all([
			context.queryClient.ensureQueryData(companyBySlugQuery(params.slug)),
			context.queryClient.ensureQueryData(categoriesQueryOptions),
		]);
	},
	component: RouteComponent,
	errorComponent: () => <div className="container px-4 py-6">Company not found</div>,
});

function RouteComponent() {
	// Route
	const context = Route.useRouteContext();
	const params = Route.useParams();
	const navigate = Route.useNavigate();

	const formRef = useRef<HTMLFormElement>(null);
	const [categories, company] = useSuspenseQueries({
		queries: [categoriesQueryOptions, companyBySlugQuery(params.slug)],
	});

	const { mutate, isPending } = useMutation({ mutationFn: useServerFn(updateCompanyInfos) });

	// states
	const [selectedCategories, setSelectedCategories] = useState(
		new Set<string>(company.data?.categories.map((c) => c?.id ?? "")),
	);
	const [descriptionLength, setDescriptionLength] = useState(
		company.data?.description?.length ?? 0,
	);

	// hooks and stores
	const setPreview = useUpdatePreviewStore((state) => state.setPreview);

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

	function onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setDescriptionLength(e.target.value.length);
	}

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const differentialFormData = getDifferentialFormData(formData);

		mutate(
			{ data: differentialFormData },
			{
				onSuccess: () => {
					context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });

					toast.success("Entreprise mise à jour avec succès");
					navigate({ to: "/compte/entreprises" });
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	}

	function getDifferentialFormData(formData: FormData) {
		const differentialFormData = new FormData();
		const formObject = Object.fromEntries(formData.entries());

		for (const [key, value] of Object.entries(formObject)) {
			const initialValue = company.data?.[key as keyof typeof company.data];
			if (initialValue !== value) differentialFormData.append(key, value);
		}

		// categories
		const initialCategories = new Set(company.data?.categories.map((c) => c?.id ?? ""));
		const currentCategories = new Set(selectedCategories);
		const hasDifferentCategoriesSize = initialCategories.size !== currentCategories.size;
		const hasDifferentCategoriesId = Array.from(initialCategories).some(
			(id) => !currentCategories.has(id),
		);

		if (hasDifferentCategoriesSize || hasDifferentCategoriesId) {
			for (const [categoryId, index] of currentCategories) {
				differentialFormData.append(`categories[${index}]`, categoryId);
			}
		}

		return differentialFormData;
	}

	return (
		<div className="container px-4 py-6">
			<div className="max-w-xl mx-auto">
				<h1 className="text-2xl font-bold mb-4">Référencez votre entreprise</h1>

				<form className="flex flex-col gap-3" ref={formRef} onSubmit={onSubmit}>
					<input type="hidden" name="companyId" value={company.data?.id} />
					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Nom de l'entreprise *</span>
						<Input
							type="text"
							name="name"
							placeholder="Ex: mon entreprise"
							className="placeholder:text-xs"
							defaultValue={company.data?.name}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Siret *</span>
						<Input
							type="text"
							name="siret"
							placeholder="Ex: 12345678901234"
							className="placeholder:text-xs"
							defaultValue={company.data?.siret}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Catégories * (max. 3)</span>
						<Popover.Root>
							<Popover.Trigger className="h-9 cursor-pointer border rounded-sm border-gray-300 px-2 py-1 text-xs flex items-center justify-between gap-2">
								<span className="rounded-sm text-xs flex items-center gap-2 text-gray-400">
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
											{categories.data?.map((category) => (
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

					{selectedCategories.size ? (
						<ul className="flex flex-wrap gap-2">
							{Array.from(selectedCategories.values()).map((categoryId, idx) => {
								const category = categories.data?.find((category) => category.id === categoryId);
								if (!category) return null;

								return (
									<li
										key={category.id}
										className="bg-gray-400 text-white px-2 py-1 rounded-sm text-xs flex items-center gap-2"
									>
										<input type="hidden" name={`categories[${idx}]`} value={category.id} />
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
					) : null}

					<Separator.Root className="h-px bg-gray-300 my-4" />

					<div className="grid gap-1">
						<Label className="flex flex-col gap-1">
							<span className="text-xs font-medium">Description</span>
							<textarea
								name="description"
								className="border rounded-sm p-2 border-gray-300 resize-none placeholder:text-xs"
								rows={4}
								placeholder="Entrer une description de mon entreprise..."
								onChange={onDescriptionChange}
								defaultValue={company.data?.description ?? ""}
							/>
						</Label>
						<span className="text-xs text-gray-500 justify-self-end">{descriptionLength}/1500</span>
					</div>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Entrepreneur</span>
						<Input
							type="text"
							name="business_owner"
							placeholder="Ex: Nom Prénom"
							className="placeholder:text-xs"
							defaultValue={company.data?.business_owner ?? ""}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Perimètre d'intervention</span>
						<Input
							type="text"
							name="service_area"
							placeholder="Ex: Paris, Lyon, Marseille"
							className="placeholder:text-xs"
							defaultValue={company.data?.service_area ?? ""}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Sous-domaine</span>
						<Input
							type="text"
							name="subdomain"
							placeholder="Ex: monentreprise"
							className="placeholder:text-xs"
							defaultValue={company.data?.subdomain ?? ""}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Email</span>
						<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
							<EmailIcon className="size-5 text-gray-500" />
							<input
								type="email"
								name="email"
								placeholder="Ex: contact@monentreprise.com"
								className="placeholder:text-xs outline-none w-full"
								defaultValue={company.data?.email ?? ""}
							/>
						</div>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Numéro de téléphone</span>
						<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
							<PhoneIcon className="size-5 text-gray-500" />
							<input
								type="tel"
								name="phone"
								placeholder="Ex: 06 06 06 06 06"
								className="placeholder:text-xs outline-none w-full"
								defaultValue={company.data?.phone ?? ""}
							/>
						</div>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Site web</span>
						<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
							<GlobeIcon className="size-5 text-gray-500" />
							<input
								type="text"
								name="website"
								placeholder="Ex: https://www.monentreprise.com"
								className="placeholder:text-xs outline-none w-full"
								defaultValue={company.data?.website ?? ""}
							/>
						</div>
					</Label>

					<Separator.Root className="h-px bg-gray-300 my-4" />

					<fieldset className="flex flex-col gap-4">
						<legend className="text-xs font-medium mb-2">Réseaux sociaux</legend>
						<Label>
							<span className="sr-only">Linkedin</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<LinkedinIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="social_media.linkedin"
									placeholder="Ex: https://www.linkedin.com/company/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={company.data?.social_media.linkedin ?? ""}
								/>
							</div>
						</Label>
						<Label>
							<span className="sr-only">Facebook</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<FacebookIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="social_media.facebook"
									placeholder="Ex: https://www.facebook.com/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={company.data?.social_media.facebook ?? ""}
								/>
							</div>
						</Label>
						<Label>
							<span className="sr-only">Instagram</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<InstagramIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="social_media.instagram"
									placeholder="Ex: https://www.instagram.com/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={company.data?.social_media.instagram ?? ""}
								/>
							</div>
						</Label>
						<Label>
							<span className="sr-only">Calendly</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<CalendlyIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="social_media.calendly"
									placeholder="Ex: https://calendly.com/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={company.data?.social_media.calendly ?? ""}
								/>
							</div>
						</Label>
					</fieldset>

					<Separator.Root className="h-px bg-gray-300 my-4" />

					<div className="grid gap-8">
						<fieldset className="flex gap-4">
							<legend className="text-xs font-medium mb-2">Mode de travail</legend>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="not_specified"
									defaultChecked={company.data?.work_mode === "not_specified"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Non spécifié</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="remote"
									defaultChecked={company.data?.work_mode === "remote"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">À distance</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="onsite"
									defaultChecked={company.data?.work_mode === "onsite"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Sur site</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="hybrid"
									defaultChecked={company.data?.work_mode === "hybrid"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Hybride</span>
							</Label>
						</fieldset>

						<fieldset className="flex gap-2">
							<legend className="text-xs font-medium mb-2">RQTH</legend>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="rqth"
									value="true"
									defaultChecked={company.data?.rqth}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Oui</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="rqth"
									value="false"
									defaultChecked={!company.data?.rqth}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Non</span>
							</Label>
						</fieldset>
					</div>

					<Separator.Root className="h-px bg-gray-300 my-4" />

					<div className="flex gap-2 justify-end">
						<button
							type="submit"
							className="bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs"
							disabled={isPending}
						>
							{isPending ? "Mise à jour en cours..." : "Mettre à jour"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
