import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { Loader, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import * as v from "valibot";
import { InputFile } from "~/components/input-file";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
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

  const { toast } = useToast();
  const { preview, setPreview, revokeAll } = useAddPreviewStore();
  const [deletingMedia, setDeletingMedia] = useState<string | null>(null);

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
    setDeletingMedia(publicId);
    deleteMedia(
      { data: { companyId, publicId, type: "logo" } },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          toast({
            description: "Logo supprimé avec succès",
            button: { label: "Fermer" },
          });
        },
        onSettled: () => setDeletingMedia(null),
      },
    );
  }

  function onDeleteGallery({
    companyId,
    publicId,
    index,
  }: { companyId: string; publicId: string; index: number }) {
    setDeletingMedia(publicId);
    deleteMedia(
      { data: { companyId, publicId, type: "gallery", index } },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          toast({
            description: "Image supprimée avec succès",
            button: { label: "Fermer" },
          });
        },
        onSettled: () => setDeletingMedia(null),
      },
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const decodedFormData = decode(formData, {
      files: ["logo", "gallery.$"],
      arrays: ["gallery", "gallery_public_id"],
    });

    console.log("decodedFormData", decodedFormData);

    const result = v.safeParse(UpdateCompanyMediaSchema, decodedFormData, {
      abortPipeEarly: true,
    });

    if (!result.success) {
      toast({
        description: (
          <span>
            {result.issues.map((issue, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <span key={idx}>{issue.message}</span>
            ))}
          </span>
        ),
        button: { label: "Fermer" },
      });
      return;
    }

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          toast({
            description: "Images mises à jour avec succès",
            button: { label: "Fermer" },
          });

          revokeAll();
          navigate({ to: "/compte/entreprises" });
        },
        onError: () => {
          toast({
            description: "Une erreur est survenue lors de la mise à jour des images",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  useEffect(() => {
    return () => revokeAll();
  }, [revokeAll]);

  return (
    <div className="max-w-fit mx-auto py-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="companyId" value={company.id} />

        <div className="flex gap-2 justify-center">
          <fieldset className="border rounded-sm border-border p-4 w-max">
            <legend className="text-xs font-medium px-2">Logo</legend>
            <div className="grid gap-2">
              <Label className="relative flex flex-col gap-1 outline-none group">
                <span className="text-xs font-medium">Logo (max. 3MB)</span>
                <div className="w-35 h-40 border border-input rounded-sm grid place-items-center group-focus-within:border-primary">
                  <input type="hidden" name="logo_public_id" value={company.logo?.publicId || ""} />
                  <InputFile
                    preview={preview.logoUrl || company.logo?.secureUrl}
                    alt="Logo"
                    onChange={(e) => onImageChange(e, "logo")}
                    accept="image/*"
                    name="logo"
                  />
                </div>
              </Label>

              <button
                type="button"
                className="text-xs font-medium text-primary-foreground bg-primary p-2 rounded-sm w-max"
                disabled={isDeletingMedia}
                onClick={() =>
                  onDeleteLogo({
                    companyId: company.id,
                    publicId: company.logo?.publicId || "",
                  })
                }
              >
                {deletingMedia === company.logo?.publicId ? (
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
                  <input
                    type="hidden"
                    name="gallery_public_id[0]"
                    value={company.gallery?.[0]?.publicId || ""}
                  />
                  <InputFile
                    preview={preview.galleryUrls?.[0] || company.gallery?.[0]?.secureUrl}
                    alt="Gallery 1"
                    onChange={(e) => onImageChange(e, "gallery", 0)}
                    accept="image/*"
                    name="gallery.0"
                  />
                </Label>

                <button
                  type="button"
                  className="text-xs font-medium text-primary-foreground bg-primary p-2 rounded-sm w-max"
                  disabled={isDeletingMedia}
                  onClick={() =>
                    onDeleteGallery({
                      companyId: company.id,
                      publicId: company.gallery?.[0]?.publicId || "",
                      index: 0,
                    })
                  }
                >
                  {deletingMedia === company.gallery?.[0]?.publicId ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    <Trash2 className="size-5" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="relative flex flex-col gap-1 outline-none group">
                  <span className="text-xs font-medium">Image 2 (max. 2MB)</span>
                  <input
                    type="hidden"
                    name="gallery_public_id[1]"
                    value={company.gallery?.[1]?.publicId || ""}
                  />
                  <InputFile
                    preview={preview.galleryUrls?.[1] || company.gallery?.[1]?.secureUrl}
                    alt="Gallery 2"
                    onChange={(e) => onImageChange(e, "gallery", 1)}
                    accept="image/*"
                    name="gallery.1"
                  />
                </Label>

                <button
                  type="button"
                  className="text-xs font-medium text-primary-foreground bg-primary p-2 rounded-sm w-max"
                  disabled={isDeletingMedia}
                  onClick={() =>
                    onDeleteGallery({
                      companyId: company.id,
                      publicId: company.gallery?.[1]?.publicId || "",
                      index: 1,
                    })
                  }
                >
                  {deletingMedia === company.gallery?.[1]?.publicId ? (
                    <Loader className="size-5 animate-spin" />
                  ) : (
                    <Trash2 className="size-5" />
                  )}
                </button>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="text-xs font-medium text-primary-foreground bg-primary px-4 py-2 rounded-sm w-max"
          >
            {isPending ? <Loader className="size-5 animate-spin" /> : "Mettre à jour"}
          </button>
        </div>
      </form>
    </div>
  );
}
