import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "~/components/input";
import { Label } from "~/components/label";
import { Command } from "cmdk";
import { useRef, useState } from "react";
import { CloseIcon } from "~/components/icons/close";
import { categoriesQueryOptions } from "~/lib/api/categories";
import { addCompany } from "~/lib/api/companies";
import { toast } from "sonner";
import { Popover, Separator } from "radix-ui";
import * as v from "valibot";
import { AddCompanySchema } from "~/lib/validator/company.schema";
import { ChevronDownIcon } from "~/components/icons/chevron-down";
import { decode } from "decode-formdata";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { InstagramIcon } from "~/components/icons/instagram";
import { CalendlyIcon } from "~/components/icons/calendly";
import { FacebookIcon } from "~/components/icons/facebook";
import { userCompaniesQueryOptions } from "~/lib/api/user";
import { PlusIcon } from "~/components/icons/plus";
import { PhoneIcon } from "~/components/icons/phone";
import { GlobeIcon } from "~/components/icons/globe";
import { EmailIcon } from "~/components/icons/email";
import { useAddPreviewStore } from "~/lib/store/preview.store";
import { useImagePreview } from "~/hooks/use-image-preview";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/add/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const userCompanies = await context.queryClient.ensureQueryData(userCompaniesQueryOptions);

		if (userCompanies && userCompanies?.length >= 3) {
			toast.error("Vous ne pouvez pas créer plus de 3 entreprises");
			throw redirect({ to: "/compte/entreprises" });
		}
	},
	loader: async ({ context }) => {
		const categories = await context.queryClient.ensureQueryData(categoriesQueryOptions);
		return { categories };
	},
});

function RouteComponent() {
	const context = Route.useRouteContext();
	const { categories } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const { mutate, isPending } = useMutation({ mutationFn: useServerFn(addCompany) });

	const formRef = useRef<HTMLFormElement>(null);
	const preview = useAddPreviewStore((state) => state.preview);
	const setPreview = useAddPreviewStore((state) => state.setPreview);

	const [selectedCategories, setSelectedCategories] = useState(
		new Set<string>(preview?.categories),
	);
	const [descriptionLength, setDescriptionLength] = useState(0);
	const { imagePreviews, readImage } = useImagePreview();

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

	function onImageChange(
		e: React.ChangeEvent<HTMLInputElement>,
		type: "logo" | "gallery",
		index?: number,
	) {
		const file = e.target.files?.[0];
		if (!file) return;
		readImage({ type, file, index });
	}

	function onPreview() {
		const formData = new FormData(formRef.current as HTMLFormElement);

		// append the selected categories to the form data
		for (const categoryId of selectedCategories) {
			formData.append("categories", categoryId);
		}

		// decode the form data
		const decodedFormData = decode(formData, {
			files: ["logo", "gallery"],
			arrays: ["categories", "gallery"],
			booleans: ["rqth"],
		});

		const result = v.safeParse(AddCompanySchema, decodedFormData, { abortPipeEarly: true });

		if (!result.success) {
			toast.error(
				<div>
					{result.issues.map((issue, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<p key={idx}>{issue.message}</p>
					))}
				</div>,
			);
			return;
		}

		setPreview(result.output);
		navigate({ to: "/compte/entreprises/add/preview" });
	}

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		for (const categoryId of selectedCategories) {
			formData.append("categories", categoryId);
		}

		mutate(
			{ data: formData },
			{
				onSuccess: () => {
					context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					toast.success("Entreprise créée avec succès");
					navigate({ to: "/compte/entreprises" });
				},
				onError: (error) => {
					console.error(error);
					toast.error(error.message);
				},
			},
		);
	}

	return (
		<div className="container px-4 py-6">
			<div className="max-w-xl mx-auto">
				<h1 className="text-2xl font-bold mb-4">Référencez votre entreprise</h1>

				<form className="flex flex-col gap-3" ref={formRef} onSubmit={onSubmit}>
					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Nom de l'entreprise *</span>
						<Input
							type="text"
							name="name"
							placeholder="Ex: mon entreprise"
							className="placeholder:text-xs"
							defaultValue={preview?.name}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Siret *</span>
						<Input
							type="text"
							name="siret"
							placeholder="Ex: 12345678901234"
							className="placeholder:text-xs"
							defaultValue={preview?.siret}
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
											{categories.map((category) => (
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
							{Array.from(selectedCategories.values()).map((categoryId) => {
								const category = categories.find((category) => category.id === categoryId);
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
								defaultValue={preview?.description}
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
							defaultValue={preview?.business_owner}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Perimètre d'intervention</span>
						<Input
							type="text"
							name="service_area"
							placeholder="Ex: Paris, Lyon, Marseille"
							className="placeholder:text-xs"
							defaultValue={preview?.service_area}
						/>
					</Label>

					<Label className="flex flex-col gap-1">
						<span className="text-xs font-medium">Sous-domaine</span>
						<Input
							type="text"
							name="subdomain"
							placeholder="Ex: monentreprise"
							className="placeholder:text-xs"
							defaultValue={preview?.subdomain}
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
								defaultValue={preview?.email}
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
								defaultValue={preview?.phone}
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
								defaultValue={preview?.website}
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
									name="linkedin"
									placeholder="Ex: https://www.linkedin.com/company/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={preview?.linkedin}
								/>
							</div>
						</Label>
						<Label>
							<span className="sr-only">Facebook</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<FacebookIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="facebook"
									placeholder="Ex: https://www.facebook.com/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={preview?.facebook}
								/>
							</div>
						</Label>
						<Label>
							<span className="sr-only">Instagram</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<InstagramIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="instagram"
									placeholder="Ex: https://www.instagram.com/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={preview?.instagram}
								/>
							</div>
						</Label>
						<Label>
							<span className="sr-only">Calendly</span>
							<div className="flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500">
								<CalendlyIcon className="size-5 text-gray-500" />
								<input
									type="text"
									name="calendly"
									placeholder="Ex: https://calendly.com/monentreprise"
									className="placeholder:text-xs outline-none w-full"
									defaultValue={preview?.calendly}
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
									defaultChecked={preview?.work_mode === "not_specified"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Non spécifié</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="remote"
									defaultChecked={preview?.work_mode === "remote"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">À distance</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="onsite"
									defaultChecked={preview?.work_mode === "onsite"}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Sur site</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="work_mode"
									value="hybrid"
									defaultChecked={preview?.work_mode === "hybrid"}
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
									defaultChecked={preview?.rqth}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Oui</span>
							</Label>
							<Label className="flex items-center gap-1">
								<Input
									type="radio"
									name="rqth"
									value="false"
									defaultChecked={!preview?.rqth}
									className="size-4 accent-gray-600"
								/>
								<span className="text-xs">Non</span>
							</Label>
						</fieldset>
					</div>

					<Separator.Root className="h-px bg-gray-300 my-4" />

					<fieldset className="border rounded-sm border-gray-300 p-4">
						<legend className="text-xs font-medium  bg-white px-2">Images</legend>

						<div className="flex gap-2 justify-center">
							<Label className="relative flex flex-col gap-1 outline-none group">
								<span className="text-xs font-medium">Logo (max. 3MB)</span>
								<div className="w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500">
									{imagePreviews.logo ? (
										<img
											src={imagePreviews.logo}
											alt="Logo"
											className="w-full h-full object-cover"
										/>
									) : (
										<PlusIcon className="size-8 rounded-full bg-gray-400 p-1 text-white" />
									)}
									<input
										type="file"
										className="absolute inset-0 opacity-0"
										name="logo"
										onChange={(e) => onImageChange(e, "logo")}
										accept="image/*"
									/>
								</div>
							</Label>

							<Label className="relative flex flex-col gap-1 outline-none group">
								<span className="text-xs font-medium">Image 1 (max. 2MB)</span>
								<div className="w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500">
									{imagePreviews.gallery[0] ? (
										<img
											src={imagePreviews.gallery[0]}
											alt="gallery 1"
											className="w-full h-full object-cover"
										/>
									) : (
										<PlusIcon className="size-8 rounded-full bg-gray-400 p-1 text-white" />
									)}
									<input
										type="file"
										className="absolute inset-0 opacity-0"
										name="gallery"
										onChange={(e) => onImageChange(e, "gallery", 0)}
										accept="image/*"
									/>
								</div>
							</Label>

							<Label className="relative flex flex-col gap-1 outline-none group">
								<span className="text-xs font-medium">Image 2 (max. 2MB)</span>
								<div className="w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500">
									{imagePreviews.gallery[1] ? (
										<img
											src={imagePreviews.gallery[1]}
											alt="gallery 2"
											className="w-full h-full object-cover"
										/>
									) : (
										<PlusIcon className="size-8 rounded-full bg-gray-400 p-1 text-white" />
									)}
									<input
										type="file"
										className="absolute inset-0 opacity-0"
										name="gallery"
										onChange={(e) => onImageChange(e, "gallery", 1)}
										accept="image/*"
									/>
								</div>
							</Label>
						</div>
					</fieldset>

					<Separator.Root className="h-px bg-gray-300 my-4" />

					<div className="flex gap-2 justify-end">
						<button
							type="button"
							className="bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs disabled:opacity-50"
							onClick={onPreview}
						>
							Prévisualiser
						</button>

						<button
							type="submit"
							className="bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs"
							disabled={isPending}
						>
							{isPending ? "Création en cours..." : "Créer un compte"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
