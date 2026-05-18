import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Command } from "cmdk";
import { decode } from "decode-formdata";
import { ChevronDown, Globe, Loader, Mail, MapPinned, Phone, X } from "lucide-react";
import { useRef, useState } from "react";
import * as v from "valibot";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/toast";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { updateCompanyInfos } from "~/lib/api/companies/mutations/update-company-infos";
import { manageCompanyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { UpdateCompanyInfosSchema } from "~/lib/validator/company.schema";
import { useUpdatePreviewStore } from "~/stores/preview.store";
import { cn } from "~/utils/cn";
import { SocialMedias } from "../../-components/social-medias";

export const Route = createFileRoute("/_protected/compte/entreprises/$slug/edit/infos")({
  loader: async ({ context, params }) => {
    // seed the cache
    await Promise.all([
      context.queryClient.ensureQueryData(manageCompanyBySlugQuery(params.slug)),
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
  const search = Route.useSearch();
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);
  const { setPreview } = useUpdatePreviewStore();
  const [categories, company] = useSuspenseQueries({
    queries: [categoriesQueryOptions, manageCompanyBySlugQuery(params.slug)],
  });

  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(updateCompanyInfos) });

  // states
  const [selectedCategories, setSelectedCategories] = useState(
    new Set<string>(company.data?.categories.map((c) => c?.id ?? "")),
  );
  const [descriptionLength, setDescriptionLength] = useState(
    company.data?.description?.length ?? 0,
  );

  function onSelectCategory(categoryId: string) {
    setSelectedCategories((prev) => {
      if (prev.size >= 3) {
        toast({
          description: "Vous ne pouvez pas sélectionner plus de 3 catégories",
          button: { label: "Fermer" },
        });
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

  function formatValidationIssues(
    issues: Array<{ path?: Array<{ key?: unknown }>; message: string }>,
  ) {
    return issues
      .map((issue) => {
        const field = issue.path?.[0]?.key;

        if (field === "categories") {
          return `Catégories: ${issue.message}`;
        }

        if (field === "description") {
          return `Description: ${issue.message}`;
        }

        return issue.message;
      })
      .join("\n");
  }

  async function copyErrorMessage(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        status: "success",
        description: "Message d'erreur copié",
        button: { label: "Fermer" },
      });
    } catch {
      toast({
        status: "error",
        description: "Impossible de copier le message d'erreur",
        button: { label: "Fermer" },
      });
    }
  }

  function onPreview() {
    const formData = new FormData(formRef.current as HTMLFormElement);
    const decodedFormData = decode(formData, {
      arrays: ["categories"],
      booleans: ["rqth"],
    });

    const result = v.safeParse(UpdateCompanyInfosSchema, decodedFormData, {
      abortPipeEarly: true,
    });

    if (!result.success) {
      const errorMessage = formatValidationIssues(result.issues);

      return toast({
        status: "error",
        title: "Prévisualisation impossible",
        description: <span className="whitespace-pre-line">{errorMessage}</span>,
        button: {
          label: "Copier",
          onClick: () => void copyErrorMessage(errorMessage),
        },
      });
    }

    setPreview({
      ...result.output,
      logoUrl: company.data?.logo?.secureUrl,
      galleryUrls: company.data?.gallery?.map((image) => image.secureUrl) ?? [],
    });

    navigate({
      to: "/compte/entreprises/$slug/edit/preview",
      params: { slug: params.slug },
      search,
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          context.queryClient.invalidateQueries({ queryKey: ["company", params.slug] });

          toast({
            description: "Entreprise mise à jour avec succès",
            button: { label: "Fermer" },
          });
          navigate({ to: "/compte/entreprises" });
        },
        onError: (error) => {
          toast({
            status: "error",
            title: "Mise à jour impossible",
            description: error.message,
            button: {
              label: "Copier",
              onClick: () => void copyErrorMessage(error.message),
            },
          });
        },
      },
    );
  }

  return (
    <div className="container py-6">
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
            <Popover>
              <PopoverTrigger className="flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-input px-2 py-1 text-xs shadow-2xs">
                <span className="flex items-center gap-2 rounded-sm text-xs text-muted-foreground">
                  Ajouter une catégorie
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-(--anchor-width) bg-popover" sideOffset={5}>
                <Command className="rounded-sm border border-input">
                  <Command.Input
                    placeholder="Rechercher une catégorie"
                    className="h-9 w-full px-2 outline-none placeholder:text-sm placeholder:font-light"
                  />
                  <Command.Separator className="h-px bg-border" />
                  <Command.List className="max-h-60 overflow-y-auto">
                    {categories.data?.map((category) => (
                      <Command.Item
                        key={category.id}
                        value={category.name}
                        disabled={selectedCategories.has(category.id)}
                        className="cursor-pointer px-2 py-1.5 text-sm font-light aria-selected:bg-muted aria-disabled:opacity-20"
                        onSelect={() => onSelectCategory(category.id)}
                      >
                        {category.name}
                      </Command.Item>
                    ))}
                  </Command.List>
                </Command>
              </PopoverContent>
            </Popover>
          </Label>

          {selectedCategories.size ? (
            <ul className="flex flex-wrap gap-2">
              {Array.from(selectedCategories.values()).map((categoryId, idx) => {
                const category = categories.data?.find((category) => category.id === categoryId);
                if (!category) return null;

                return (
                  <li
                    key={category.id}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs flex items-center gap-2"
                  >
                    <input type="hidden" name={`categories[${idx}]`} value={category.id} />
                    <span className="max-w-[30ch] truncate">{category.name}</span>
                    <button
                      type="button"
                      className="text-white inline-grid place-items-center cursor-pointer"
                      onClick={() => onRemoveCategory(category.id)}
                    >
                      <X className="size-3 text-secondary-foreground" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="grid gap-1">
            <Label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Description</span>
              <textarea
                name="description"
                className="w-full border rounded-sm p-2 border-input placeholder:text-xs focus-visible:outline-primary"
                rows={6}
                placeholder="Entrer une description de mon entreprise..."
                onChange={onDescriptionChange}
                defaultValue={company.data?.description ?? ""}
              />
            </Label>
            <span
              className={cn(
                "text-xs mt-1 justify-self-end px-2 py-0.5 rounded-xs bg-muted text-muted-foreground transition-colors",
                descriptionLength > 2000 && "text-destructive-foreground bg-destructive",
              )}
            >
              {descriptionLength}/2000
            </span>
          </div>

          <Separator className="h-px bg-border my-4" />

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Entrepreneur</span>
            <Input
              type="text"
              name="business_owner"
              placeholder="Ex: Nom Prénom"
              defaultValue={company.data?.business_owner ?? ""}
            />
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Sous-domaine</span>
            <Input
              type="text"
              name="subdomain"
              placeholder="Ex: monentreprise"
              defaultValue={company.data?.subdomain ?? ""}
            />
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Perimètre d'intervention</span>
            <div className="relative w-full">
              <MapPinned className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type="text"
                name="service_area"
                placeholder="Ex: Paris, Lyon, Marseille"
                className="ps-8"
                defaultValue={company.data?.service_area ?? ""}
              />
            </div>
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Email</span>
            <div className="relative w-full">
              <Mail className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type="email"
                name="email"
                placeholder="Ex: contact@monentreprise.com"
                className="ps-8"
                defaultValue={company.data?.email ?? ""}
              />
            </div>
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Numéro de téléphone</span>
            <div className="relative w-full">
              <Phone className="size-4 text-muted-foregound absolute start-2 top-2.5" />
              <Input
                type="tel"
                name="phone"
                placeholder="Ex: 06 06 06 06 06"
                className="ps-8"
                defaultValue={company.data?.phone ?? ""}
              />
            </div>
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Site web</span>
            <div className="relative w-full">
              <Globe className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type="text"
                name="website"
                placeholder="Ex: https://www.monentreprise.com"
                className="ps-8"
                defaultValue={company.data?.website ?? ""}
              />
            </div>
          </Label>

          <Separator className="h-px bg-border my-4" />

          <div className="grid gap-8">
            <fieldset className="flex gap-4">
              <legend className="text-xs font-medium mb-2">Mode de travail</legend>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="not_specified"
                  defaultChecked={company.data?.work_mode === "not_specified"}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Non spécifié</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="remote"
                  defaultChecked={company.data?.work_mode === "remote"}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">À distance</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="onsite"
                  defaultChecked={company.data?.work_mode === "onsite"}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Sur site</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="hybrid"
                  defaultChecked={company.data?.work_mode === "hybrid"}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Hybride</span>
              </Label>
            </fieldset>

            <fieldset className="flex gap-2">
              <legend className="text-xs font-medium mb-2">RQTH</legend>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rqth"
                  value="true"
                  defaultChecked={company.data?.rqth}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Oui</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rqth"
                  value="false"
                  defaultChecked={!company.data?.rqth}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Ne souhaite pas répondre</span>
              </Label>
            </fieldset>
          </div>

          <Separator className="h-px bg-border my-4" />

          <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-card px-4 py-3">
            <div className="grid gap-1">
              <p className="text-sm font-medium">Images entreprise</p>
              <p className="text-xs text-muted-foreground">
                Logo et galerie se modifient dans onglet média.
              </p>
            </div>

            <Link
              to="/compte/entreprises/$slug/edit/medias"
              params={{ slug: params.slug }}
              search={search}
              className="rounded-sm border border-border bg-muted px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/80"
            >
              Gérer les images
            </Link>
          </div>

          <Separator className="h-px bg-border my-4" />

          <SocialMedias company={company.data} />

          <Separator className="h-px bg-border my-4" />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-secondary text-secondary-foreground px-3 py-2 rounded-sm font-light text-xs hover:bg-secondary/90"
              onClick={onPreview}
            >
              Prévisualiser
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-3 py-2 rounded-sm font-light text-xs"
              disabled={isPending}
            >
              {isPending ? <Loader className="size-4 animate-spin" /> : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
