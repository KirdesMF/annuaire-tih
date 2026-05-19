import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { useToast } from "~/components/ui/toast";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { updateCompanyInfos } from "~/lib/api/companies/mutations/update-company-infos";
import { CompanyPreview } from "~/routes/_protected/compte/entreprises/-components/company-preview";
import { useUpdatePreviewStore } from "~/stores/preview.store";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit/preview")({
  component: RouteComponent,
  beforeLoad: ({ params, search }) => {
    const preview = useUpdatePreviewStore.getState().preview;
    if (!preview) {
      throw redirect({
        to: "/compte/entreprises/$slug/edit/infos",
        params,
        search,
      });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions);
  },
});

function RouteComponent() {
  const { toast } = useToast();
  const { queryClient } = Route.useRouteContext();
  const params = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const preview = useUpdatePreviewStore((state) => state.preview);
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);
  const { revokeAll, reset } = useUpdatePreviewStore();

  const { mutate, isPending } = useMutation({
    mutationFn: useServerFn(updateCompanyInfos),
  });

  useEffect(() => {
    return () => {
      revokeAll();
    };
  }, [revokeAll]);

  if (!preview) {
    return null;
  }

  const previewData = preview;

  function onValidate() {
    const formData = new FormData();

    for (const [key, value] of Object.entries(previewData)) {
      if (typeof value === "string") {
        formData.append(key, value);
      }
    }

    for (const categoryId of previewData.categories) {
      formData.append("categories", categoryId);
    }

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            description: "Entreprise mise à jour avec succès",
            button: { label: "Fermer" },
          });
          queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          queryClient.invalidateQueries({ queryKey: ["company", params.slug] });
          reset();
          navigate({ to: "/compte/entreprises" });
        },
      },
    );
  }

  return (
    <CompanyPreview
      title="Prévisualisation avant mise à jour"
      backTo="/compte/entreprises/$slug/edit/infos"
      backParams={{ slug: params.slug }}
      backSearch={search}
      submitLabel="Valider"
      pendingLabel="Validation en cours..."
      isPending={isPending}
      onConfirm={onValidate}
      preview={previewData}
      categories={categories}
      logoUrl={previewData.logoUrl}
      galleryUrls={previewData.galleryUrls}
    />
  );
}
