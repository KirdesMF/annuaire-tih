import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "~/components/icons/plus";
import { Label } from "~/components/label";
import { useImagePreview } from "~/hooks/use-image-preview";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";

export const Route = createFileRoute(
	"/_protected/compte/entreprises/$slug/edit/medias",
)({
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(companyBySlugQuery(params.slug));
	},
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();
	const { data: company } = useSuspenseQuery(companyBySlugQuery(params.slug));
	const { imagePreviews, readImage } = useImagePreview();

	function onImageChange(
		e: React.ChangeEvent<HTMLInputElement>,
		type: "logo" | "gallery",
		index?: number,
	) {
		const file = e.target.files?.[0];
		if (!file) return;
		readImage({ type, file, index });
	}

	return (
		<div>
			<form action="">
				<fieldset className="border rounded-sm border-gray-300 p-4">
					<legend className="text-xs font-medium  bg-white px-2">Images</legend>

					<div className="flex gap-2 justify-center">
						<Label className="relative flex flex-col gap-1 outline-none group">
							<span className="text-xs font-medium">Logo (max. 3MB)</span>
							<div className="w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500">
								{imagePreviews.logo || company.logo ? (
									<img
										src={imagePreviews.logo || company.logo?.secureUrl}
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
								{imagePreviews.gallery[0] || company.gallery?.[0] ? (
									<img
										src={imagePreviews.gallery[0] || company.gallery?.[0].secureUrl}
										alt="gallery 1"
										className="w-full h-full object-cover"
									/>
								) : (
									<PlusIcon className="size-8 rounded-full bg-gray-400 p-1 text-white" />
								)}
								<input
									type="file"
									className="absolute inset-0 opacity-0"
									name="gallery[0]"
									onChange={(e) => onImageChange(e, "gallery", 0)}
									accept="image/*"
								/>
							</div>
						</Label>

						<Label className="relative flex flex-col gap-1 outline-none group">
							<span className="text-xs font-medium">Image 2 (max. 2MB)</span>
							<div className="w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500">
								{imagePreviews.gallery[1] || company.gallery?.[1] ? (
									<img
										src={imagePreviews.gallery[1] || company.gallery?.[1].secureUrl}
										alt="gallery 2"
										className="w-full h-full object-cover"
									/>
								) : (
									<PlusIcon className="size-8 rounded-full bg-gray-400 p-1 text-white" />
								)}
								<input
									type="file"
									className="absolute inset-0 opacity-0"
									name="gallery[1]"
									onChange={(e) => onImageChange(e, "gallery", 1)}
									accept="image/*"
								/>
							</div>
						</Label>
					</div>
				</fieldset>
			</form>
		</div>
	);
}
