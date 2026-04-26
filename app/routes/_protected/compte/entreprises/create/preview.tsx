import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CompanyPreview } from "~/routes/_protected/compte/entreprises/-components/company-preview";
import { useToast } from "~/components/ui/toast";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { createCompany } from "~/lib/api/companies/mutations/create-company";
import { useAddPreviewStore } from "~/stores/preview.store";

export const Route = createFileRoute("/_protected/compte/entreprises/create/preview")({
  component: RouteComponent,
  beforeLoad: () => {
    const preview = useAddPreviewStore.getState().preview;
    if (!preview.name || !preview.siret || preview.categories.length === 0) {
      throw redirect({ to: "/compte/entreprises/create" });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions);
  },
});

function RouteComponent() {
  const { queryClient } = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const preview = useAddPreviewStore((state) => state.preview);
  const { reset } = useAddPreviewStore();
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(createCompany) });
  const { toast } = useToast();

  if (!preview.name || !preview.siret || preview.categories.length === 0) {
    return null;
  }

  function onValidate() {
    const formData = new FormData();

    for (const [key, value] of Object.entries(preview)) {
      if (typeof value === "string") {
        formData.append(key, value);
      }
    }

    for (const categoryId of preview.categories) {
      formData.append("categories", categoryId);
    }

    if (preview.logo) {
      formData.append("logo", preview.logo);
    }

    if (preview.gallery) {
      for (const image of preview.gallery) {
        if (image) {
          formData.append("gallery", image);
        }
      }
    }

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            description: "Entreprise créée avec succès",
            button: { label: "Fermer" },
          });
          queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          reset();
          navigate({ to: "/compte/entreprises" });
        },
      },
    );
  }

  return (
    <CompanyPreview
      title="Prévisualisation avant création"
      backTo="/compte/entreprises/create"
      submitLabel="Valider"
      pendingLabel="Validation en cours..."
      isPending={isPending}
      onConfirm={onValidate}
      preview={preview}
      categories={categories}
      logoUrl={preview.logoUrl}
      galleryUrls={preview.galleryUrls}
    />
  );
}
