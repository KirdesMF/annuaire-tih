import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { Loader, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";
import { Label } from "~/components/label";
import { deleteCompanyMedia } from "~/lib/api/companies/mutations/delete-company-media";
import { updateCompanyMedia } from "~/lib/api/companies/mutations/update-company-medias";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { UpdateCompanyMediaSchema } from "~/lib/validator/company.schema";
import { useAddPreviewStore } from "~/stores/preview.store";

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
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(updateCompanyMedia) });
  const { mutate: deleteMedia, isPending: isDeletingMedia } = useMutation({
    mutationFn: useServerFn(deleteCompanyMedia),
  });
  const { preview, setPreview } = useAddPreviewStore();

  function onImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "gallery",
    index?: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "logo") {
      setPreview({ ...preview, logo: file, logoUrl: URL.createObjectURL(file) });
    }
    if (type === "gallery" && index !== undefined) {
      const currentGallery = preview.gallery ? [...preview.gallery] : [];
      currentGallery[index] = file;
      setPreview({
        ...preview,
        gallery: currentGallery,
        galleryUrls: currentGallery.map((image) => URL.createObjectURL(image)),
      });
    }
  }

  function onDeleteLogo({ companyId, publicId }: { companyId: string; publicId: string }) {
    deleteMedia(
      { data: { companyId, publicId, type: "logo" } },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          toast.success("Logo supprimé avec succès");
        },
      },
    );
  }

  function onDeleteGallery({
    companyId,
    publicId,
    index,
  }: { companyId: string; publicId: string; index: number }) {
    deleteMedia(
      { data: { companyId, publicId, type: "gallery", index } },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          toast.success("Image supprimée avec succès");
        },
      },
    );
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
          <fieldset className="border rounded-sm border-border p-4 w-max">
            <legend className="text-xs font-medium px-2">Logo</legend>
            <div className="grid gap-2">
              <Label className="relative flex flex-col gap-1 outline-none group">
                <span className="text-xs font-medium">Logo (max. 3MB)</span>
                <div className="w-35 h-40 border border-input rounded-sm grid place-items-center group-focus-within:border-primary">
                  {preview.logo || company.logo?.secureUrl ? (
                    <img
                      src={
                        preview.logo ? URL.createObjectURL(preview.logo) : company.logo?.secureUrl
                      }
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Plus className="size-8 rounded-full p-1 bg-muted text-muted-foreground" />
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

              <button
                type="button"
                className="text-xs font-medium text-primary-foreground bg-primary p-2 rounded-sm w-max"
                onClick={() =>
                  onDeleteLogo({
                    companyId: company.id,
                    publicId: company.logo?.publicId || "",
                  })
                }
              >
                {isDeletingMedia ? (
                  <Loader className="size-5 animate-spin" />
                ) : (
                  <Trash2 className="size-5" />
                )}
              </button>
            </div>
          </fieldset>

          <fieldset className="border rounded-sm border-border p-4">
            <legend className="text-xs font-mediu px-2">Galerie</legend>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2">
                <Label className="relative flex flex-col gap-1 outline-none group">
                  <span className="text-xs font-medium">Image 1 (max. 2MB)</span>
                  <div className="w-35 h-40 border border-input rounded-sm grid place-items-center group-focus-within:border-primary">
                    {preview.gallery?.[0] || company.gallery?.[0]?.secureUrl ? (
                      <img
                        src={
                          preview.gallery?.[0]
                            ? URL.createObjectURL(preview.gallery?.[0])
                            : company.gallery?.[0].secureUrl
                        }
                        alt="gallery 1"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Plus className="size-8 rounded-full bg-muted p-1 text-muted-foreground" />
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

                <button
                  type="button"
                  className="text-xs font-medium text-primary-foreground bg-primary p-2 rounded-sm w-max"
                  onClick={() =>
                    onDeleteGallery({
                      companyId: company.id,
                      publicId: company.gallery?.[0]?.publicId || "",
                      index: 0,
                    })
                  }
                >
                  {isDeletingMedia ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    <Trash2 className="size-5" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="relative flex flex-col gap-1 outline-none group">
                  <span className="text-xs font-medium">Image 2 (max. 2MB)</span>
                  <div className="w-35 h-40 border border-input rounded-sm grid place-items-center group-focus-within:border-primary">
                    {preview.gallery?.[1] || company.gallery?.[1]?.secureUrl ? (
                      <img
                        src={
                          preview.gallery?.[1]
                            ? URL.createObjectURL(preview.gallery?.[1])
                            : company.gallery?.[1].secureUrl
                        }
                        alt="gallery 2"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Plus className="size-8 rounded-full bg-muted p-1 text-muted-foreground" />
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
                <button
                  type="button"
                  className="text-xs font-medium text-primary-foreground bg-primary p-2 rounded-sm w-max"
                  onClick={() =>
                    onDeleteGallery({
                      companyId: company.id,
                      publicId: company.gallery?.[1]?.publicId || "",
                      index: 1,
                    })
                  }
                >
                  {isDeletingMedia ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    <Trash2 className="size-5" />
                  )}
                </button>
              </div>
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          className="text-xs font-medium text-primary-foreground bg-primary px-4 py-2 rounded-sm w-max"
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
