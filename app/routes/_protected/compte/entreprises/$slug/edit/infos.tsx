import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Command } from "cmdk";
import { ChevronDown, Globe, Loader, Mail, MapPinned, Phone, X } from "lucide-react";
import { Popover, Separator } from "radix-ui";
import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { updateCompanyInfos } from "~/lib/api/companies/mutations/update-company-infos";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { SocialMedias } from "../../-components/social-medias";

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
  const { toast } = useToast();

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
            description: error.message,
            button: { label: "Fermer" },
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
            <Popover.Root>
              <Popover.Trigger className="h-9 cursor-pointer border rounded-sm border-input px-2 py-1 text-xs flex items-center justify-between gap-2 shadow-2xs">
                <span className="rounded-sm text-xs flex items-center gap-2 text-muted-foreground">
                  Ajouter une catégorie
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="bg-popover w-(--radix-popper-anchor-width)"
                  sideOffset={5}
                >
                  <Command className="border rounded-sm border-input">
                    <Command.Input
                      placeholder="Rechercher une catégorie"
                      className="w-full h-9 px-2 outline-none placeholder:text-sm placeholder:font-light"
                    />
                    <Command.Separator className="h-px bg-border" />
                    <Command.List className="max-h-60 overflow-y-auto">
                      {categories.data?.map((category) => (
                        <Command.Item
                          key={category.id}
                          value={category.name}
                          disabled={selectedCategories.has(category.id)}
                          className="cursor-pointer py-1.5 px-2 aria-selected:bg-muted text-sm font-light aria-disabled:opacity-20"
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
                className="border rounded-sm p-2 border-input placeholder:text-xs focus-visible:outline-primary"
                rows={6}
                placeholder="Entrer une description de mon entreprise..."
                onChange={onDescriptionChange}
                defaultValue={company.data?.description ?? ""}
              />
            </Label>
            <span className="text-xs justify-self-end">{descriptionLength}/1500</span>
          </div>

          <Separator.Root className="h-px bg-border my-4" />

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
            <div className="relative">
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
            <div className="relative">
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
            <div className="relative">
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
            <div className="relative">
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

          <Separator.Root className="h-px bg-border my-4" />

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

          <Separator.Root className="h-px bg-border my-4" />

          <SocialMedias company={company.data} />

          <Separator.Root className="h-px bg-border my-4" />

          <div className="flex gap-2 justify-end">
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
