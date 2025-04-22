import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PlusIcon } from "~/components/icons/plus";
import { Label } from "~/components/label";
import { useImagePreview } from "~/hooks/use-image-preview";
import { updateCompanyMedia } from "~/lib/api/companies/mutations/update-company-medias";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { UpdateCompanyMediaSchema } from "~/lib/validator/company.schema";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit/medias")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(companyBySlugQuery(params.slug));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const { data: company } = useSuspenseQuery(companyBySlugQuery(params.slug));
  const { imagePreviews, readImage } = useImagePreview();
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(updateCompanyMedia) });

  function onImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "gallery",
    index?: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    readImage({ type, file, index });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const decodedFormData = decode(formData, {
      files: ["logo", "gallery"],
      arrays: ["gallery", "gallery_public_id"],
    });

    const result = v.safeParse(UpdateCompanyMediaSchema, decodedFormData, {
      abortPipeEarly: true,
    });

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

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          toast.success("Images mises à jour avec succès");
          navigate({ to: "/compte/entreprises" });
        },
        onError: (error) => {
          console.error(error);
          toast.error("Une erreur est survenue lors de la mise à jour des images");
        },
      },
    );
  }
  return (
    <div className="container py-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4 items-center">
        <input type="hidden" name="companyId" value={company.id} />
        <div className="flex flex-col gap-2 justify-center">
          <fieldset className="border rounded-sm border-gray-300 p-4 w-max">
            <legend className="text-xs font-medium  bg-white px-2">Logo</legend>
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
                <input type="hidden" name="logo_public_id" value={company.logo?.publicId} />
              </div>
            </Label>
          </fieldset>

          <fieldset className="border rounded-sm border-gray-300 p-4">
            <legend className="text-xs font-medium  bg-white px-2">Galerie</legend>
            <div className="flex gap-2">
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
                  <input
                    type="hidden"
                    name="gallery_public_id[0]"
                    value={company.gallery?.[0]?.publicId}
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
                  <input
                    type="hidden"
                    name="gallery_public_id[1]"
                    value={company.gallery?.[1]?.publicId}
                  />
                </div>
              </Label>
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          className="text-xs font-medium text-white bg-primary px-4 py-2 rounded-sm w-max"
        >
          {isPending ? "En cours..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
