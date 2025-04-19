import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Separator } from "radix-ui";
import { useEffect } from "react";
import { toast } from "sonner";
import { CompanyLogo } from "~/components/company-logo";
import { CopyButton } from "~/components/copy-button";
import { CalendlyIcon } from "~/components/icons/calendly";
import { EmailIcon } from "~/components/icons/email";
import { FacebookIcon } from "~/components/icons/facebook";
import { GlobeIcon } from "~/components/icons/globe";
import { InstagramIcon } from "~/components/icons/instagram";
import { LinkChainIcon } from "~/components/icons/link-chain";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { PhoneIcon } from "~/components/icons/phone";
import { useImagePreview } from "~/hooks/use-image-preview";
import { categoriesQueryOptions } from "~/lib/api/categories";
import { updateCompany } from "~/lib/api/companies";
import { useUpdatePreviewStore } from "~/lib/store/preview.store";
import type { Entries } from "~/utils/types";

export const Route = createFileRoute("/_protected/_compte/compte/entreprises/$slug/preview")({
	component: RouteComponent,
	beforeLoad: () => {
		const preview = useUpdatePreviewStore.getState().preview;
		if (!preview) {
			throw redirect({ to: "/compte/entreprises/add" });
		}
		return { preview };
	},
	loader: async ({ context }) => {
		const categories = await context.queryClient.ensureQueryData(categoriesQueryOptions);
		return { categories };
	},
});

const WORK_MODES = {
	remote: "À distance",
	hybrid: "Hybride",
	onsite: "Sur site",
	not_specified: "Non spécifié",
} as const;

const SOCIAL_MEDIA_ICONS = {
	facebook: <FacebookIcon className="size-5" />,
	instagram: <InstagramIcon className="size-5" />,
	linkedin: <LinkedinIcon className="size-5" />,
	calendly: <CalendlyIcon className="size-5" />,
} as const;

function RouteComponent() {
	const { preview, queryClient } = Route.useRouteContext();
	const { categories } = Route.useLoaderData();
	const params = Route.useParams();
	const navigate = Route.useNavigate();
	const { imagePreviews, readImage } = useImagePreview();

	const { mutate, isPending } = useMutation({ mutationFn: useServerFn(updateCompany) });

	useEffect(() => {
		if (preview.logo) {
			readImage({ type: "logo", file: preview.logo });
		}

		if (preview.gallery) {
			preview.gallery.forEach((image, index) => {
				readImage({ type: "gallery", file: image, index });
			});
		}
	}, [preview.logo, preview.gallery, readImage]);

	const socialMedia = {
		facebook: preview.facebook,
		instagram: preview.instagram,
		linkedin: preview.linkedin,
		calendly: preview.calendly,
	};

	const isSocialMediaEmpty = Object.values(socialMedia).every((value) => value === "");

	function onValidate() {
		const formData = new FormData();
		for (const [key, value] of Object.entries(preview)) {
			if (typeof value === "string") {
				formData.append(key, value);
			}
		}

		for (const categoryId of preview?.categories ?? []) {
			formData.append("categories", categoryId);
		}

		if (preview.logo) {
			formData.append("logo", preview.logo);
		}

		if (preview.gallery) {
			for (const image of preview.gallery) {
				formData.append("gallery", image);
			}
		}

		console.log(Object.fromEntries(formData.entries()));

		mutate(
			{ data: formData },
			{
				onSuccess: () => {
					toast.success("Entreprise mise à jour avec succès");
					queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
					queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
					navigate({ to: "/compte/entreprises" });
				},
			},
		);
	}

	return (
		<main className="px-4 py-8 grid gap-4">
			<Link to="/compte/entreprises/add" className="text-sm text-gray-500">
				Retour
			</Link>
			<div className="container flex justify-between gap-4 border border-gray-300 p-6 rounded-sm">
				<div className="flex flex-col gap-2">
					<CompanyLogo url={imagePreviews.logo} name={preview.name ?? ""} size="lg" />
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold">{preview.name}</h1>
						<CopyButton>{preview.siret}</CopyButton>
					</div>

					{preview.categories?.length ? (
						<ul className="flex flex-wrap gap-2">
							{preview.categories?.map((categoryId) => {
								const category = categories.find((category) => category.id === categoryId);
								if (!category) return null;
								return (
									<li
										key={category.id}
										className="bg-gray-400 text-white px-2 py-1 rounded-sm text-xs"
									>
										<span className="max-w-[30ch] truncate">{category.name}</span>
									</li>
								);
							})}
						</ul>
					) : null}
				</div>

				<div className="flex gap-2">
					<button type="button" className="bg-gray-100 p-2 rounded-sm cursor-pointer h-min">
						<LinkChainIcon className="size-5" />
					</button>
				</div>
			</div>

			<div className="container flex gap-2">
				<div className="flex-1 flex flex-col justify-center gap-4 border border-gray-300 p-6 rounded-sm">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<EmailIcon className="size-5" />
							<p className="text-xs text-gray-500">{preview.email || "Non renseigné"}</p>
						</div>

						<div className="flex items-center gap-2">
							<PhoneIcon className="size-5" />
							<p className="text-xs text-gray-500">{preview.phone || "Non renseigné"}</p>
						</div>

						<div className="flex items-center gap-2">
							<GlobeIcon className="size-5" />
							{preview.website ? (
								<a
									href={preview.website}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-gray-500"
								>
									{preview.website}
								</a>
							) : (
								<span className="text-xs text-gray-500">Non renseigné</span>
							)}
						</div>
					</div>

					{!isSocialMediaEmpty ? (
						<ul className="flex gap-2">
							{(Object.entries(socialMedia) as Entries<typeof socialMedia>).map(([key, value]) => (
								<li key={key}>
									<a href={value} target="_blank" rel="noopener noreferrer">
										{SOCIAL_MEDIA_ICONS[key]}
									</a>
								</li>
							))}
						</ul>
					) : null}
				</div>

				<div className="flex-1 border border-gray-300 p-6 rounded-sm flex flex-col gap-2">
					<p className="text-sm text-gray-500">
						<span className="font-bold">Entrepreneur:</span>{" "}
						{preview.business_owner || "Non renseigné"}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">Zone géographique:</span>{" "}
						{preview.service_area || "Non renseigné"}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">Mode de travail:</span>{" "}
						{WORK_MODES[preview.work_mode ?? "not_specified"]}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">RQTH:</span> {preview.rqth ? "Oui" : "Non"}
					</p>
					<p className="text-sm text-gray-500">
						<span className="font-bold">Sous domaine:</span> {preview.subdomain || "Non renseigné"}
					</p>
				</div>
			</div>

			<div className="container border border-gray-300 p-6 rounded-sm grid gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-bold">Description</h2>
					<p className="text-sm text-gray-500 text-pretty">
						{preview.description || "Non renseigné"}
					</p>
				</div>

				{imagePreviews.gallery.length ? (
					<>
						<Separator.Root className="h-px bg-gray-300 my-4" />
						<ul className="flex flex-wrap gap-2">
							{imagePreviews.gallery.map((image, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<li key={index}>
									<img
										src={image}
										alt={preview.name}
										className="size-16 aspect-square rounded-sm"
									/>
								</li>
							))}
						</ul>
					</>
				) : null}
			</div>

			<div className="container flex justify-end gap-2">
				<Link
					to="/compte/entreprises/$slug/edit"
					params={{ slug: params.slug }}
					className="bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs"
				>
					Retour
				</Link>

				<button
					type="submit"
					className="bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs"
					onClick={onValidate}
					disabled={isPending}
				>
					{isPending ? "Validation en cours..." : "Valider"}
				</button>
			</div>
		</main>
	);
}
