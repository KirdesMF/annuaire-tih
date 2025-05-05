import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Command } from "cmdk";
import { decode } from "decode-formdata";
import { ChevronDown, Globe, Loader, Mail, MapPinned, Phone, X } from "lucide-react";
import { Popover, Separator } from "radix-ui";
import { useRef, useState } from "react";
import * as v from "valibot";
import { InputFile } from "~/components/input-file";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/toast";
import { categoriesQueryOptions } from "~/lib/api/categories/queries/get-categories";
import { createCompany } from "~/lib/api/companies/mutations/create-company";
import { userCompaniesQuery } from "~/lib/api/users/queries/get-user-companies";
import { CreateCompanySchema } from "~/lib/validator/company.schema";
import { useAddPreviewStore } from "~/stores/preview.store";
import { cn } from "~/utils/cn";
import { SocialMedias } from "../-components/social-medias";

export const Route = createFileRoute("/_protected/compte/entreprises/create/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const userCompanies = await context.queryClient.ensureQueryData(
      userCompaniesQuery(context.user.id),
    );

    if (userCompanies && userCompanies?.length >= 3) {
      throw redirect({ to: "/compte/entreprises" });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQueryOptions);
  },
});

function RouteComponent() {
  const { toast } = useToast();
  const context = Route.useRouteContext();
  const navigate = Route.useNavigate();
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions);
  const { mutate, isPending } = useMutation({ mutationFn: useServerFn(createCompany) });
  const { preview, setPreview } = useAddPreviewStore();

  const formRef = useRef<HTMLFormElement>(null);

  const [selectedCategories, setSelectedCategories] = useState(
    new Set<string>(preview?.categories),
  );
  const [descriptionLength, setDescriptionLength] = useState(0);

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

  async function onImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "gallery",
    index?: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "logo") {
      const logoUrl = URL.createObjectURL(file);
      setPreview({ ...preview, logo: file, logoUrl });
    }

    if (type === "gallery" && index !== undefined) {
      const currentGallery = preview.gallery ? [...preview.gallery] : [];
      const currentGalleryUrls = preview.galleryUrls ? [...preview.galleryUrls] : [];
      currentGallery[index] = file;
      currentGalleryUrls[index] = URL.createObjectURL(file);
      setPreview({ ...preview, gallery: currentGallery, galleryUrls: currentGalleryUrls });
    }
  }

  function onPreview() {
    const formData = new FormData(formRef.current as HTMLFormElement);

    // decode the form data
    const decodedFormData = decode(formData, {
      files: ["logo", "gallery"],
      arrays: ["categories", "gallery"],
      booleans: ["rqth"],
    });

    const result = v.safeParse(CreateCompanySchema, decodedFormData, { abortPipeEarly: true });

    if (!result.success) {
      toast({
        description: (
          <div>
            {result.issues.map((issue, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <p key={idx}>{issue.message}</p>
            ))}
          </div>
        ),
        button: { label: "Fermer" },
      });
      return;
    }

    setPreview({ ...preview, ...result.output });
    navigate({ to: "/compte/entreprises/create/preview" });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (preview.logoUrl) {
      URL.revokeObjectURL(preview.logoUrl);
    }

    if (preview.galleryUrls) {
      for (const url of preview.galleryUrls) {
        URL.revokeObjectURL(url);
      }
    }

    mutate(
      { data: formData },
      {
        onSuccess: () => {
          context.queryClient.invalidateQueries({ queryKey: ["user", "companies"] });
          toast({
            description: "Entreprise créée avec succès",
            button: { label: "Fermer" },
          });
          navigate({ to: "/compte/entreprises" });
        },
        onError: () => {
          toast({
            description: "Une erreur est survenue lors de la création de l'entreprise",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  return (
    <div className="container px-4 py-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Référencez votre entreprise</h1>

        <form className="flex flex-col gap-3" ref={formRef} onSubmit={onSubmit}>
          <input type="hidden" name="user_id" value={context.user.id} />

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Nom de l'entreprise *</span>
            <Input
              type="text"
              name="name"
              placeholder="Ex: mon entreprise"
              defaultValue={preview?.name}
            />
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Siret *</span>
            <Input
              type="text"
              name="siret"
              placeholder="Ex: 12345678901234"
              defaultValue={preview?.siret}
            />
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Catégories * (max. 3)</span>
            <Popover.Root>
              <Popover.Trigger className="h-10 cursor-pointer ring-1 ring-input/50 rounded-sm px-2 py-1 text-xs flex items-center justify-between gap-2 shadow-2xs">
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
                  <Command className="border border-input rounded-sm">
                    <Command.Input
                      placeholder="Rechercher une catégorie"
                      className="w-full h-10 px-2 outline-none placeholder:text-sm placeholder:font-light"
                    />
                    <Command.Separator className="h-px bg-border" />
                    <Command.List className="max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <Command.Item
                          key={category.id}
                          value={category.name}
                          disabled={selectedCategories.has(category.id)}
                          className="cursor-pointer py-1.5 px-2 aria-selected:bg-secondary aria-selected:text-secondary-foreground text-sm font-light aria-disabled:opacity-20"
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
                const category = categories.find((category) => category.id === categoryId);
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
                      className="text-secondary-foreground inline-grid place-items-center cursor-pointer"
                      onClick={() => onRemoveCategory(category.id)}
                      tabIndex={-1}
                    >
                      <X className="size-3" />
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
                className="ring-1 ring-input/50 shadow-2xs rounded-sm p-2 placeholder:text-xs focus-visible:outline-primary"
                rows={6}
                placeholder="Entrer une description de l'entreprise..."
                onChange={onDescriptionChange}
                defaultValue={preview?.description}
              />
            </Label>
            <span
              className={cn(
                "text-xs mt-1 justify-self-end px-2 py-0.5 rounded-xs bg-muted text-muted-foreground transition-colors",
                descriptionLength > 1500 && "text-destructive-foreground bg-destructive",
              )}
            >
              {descriptionLength}/1500
            </span>
          </div>

          <Separator.Root className="h-px bg-border my-4" />

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Entrepreneur</span>
            <Input
              type="text"
              name="business_owner"
              placeholder="Ex: Nom Prénom"
              defaultValue={preview?.business_owner}
            />
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Sous-domaine</span>
            <Input
              type="text"
              name="subdomain"
              placeholder="Ex: monentreprise"
              defaultValue={preview?.subdomain}
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
                defaultValue={preview?.service_area}
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
                defaultValue={preview?.email}
              />
            </div>
          </Label>

          <Label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Numéro de téléphone</span>
            <div className="relative">
              <Phone className="size-4 text-muted-foreground absolute start-2 top-2.5" />
              <Input
                type="tel"
                name="phone"
                placeholder="Ex: 06 06 06 06 06"
                className="ps-8"
                defaultValue={preview?.phone}
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
                defaultValue={preview?.website}
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
                  defaultChecked={preview?.work_mode === "not_specified" || !preview?.work_mode}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Non spécifié</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="remote"
                  defaultChecked={preview?.work_mode === "remote"}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">À distance</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="onsite"
                  defaultChecked={preview?.work_mode === "onsite"}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Sur site</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="work_mode"
                  value="hybrid"
                  defaultChecked={preview?.work_mode === "hybrid"}
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
                  defaultChecked={preview?.rqth}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Oui</span>
              </Label>
              <Label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rqth"
                  value="false"
                  defaultChecked={!preview?.rqth}
                  className="size-4 accent-primary"
                />
                <span className="text-xs">Non</span>
              </Label>
            </fieldset>
          </div>

          <Separator.Root className="h-px bg-border my-4" />

          <SocialMedias />

          <Separator.Root className="h-px bg-border my-4" />

          <fieldset className="border rounded-sm border-border p-4">
            <legend className="text-sm font-medium px-2">Images</legend>

            <div className="flex gap-2 justify-center">
              <Label className="relative flex flex-col gap-1 outline-none group">
                <span className="text-xs font-medium">Logo (max. 3MB)</span>
                <InputFile
                  preview={preview.logoUrl}
                  alt="Logo"
                  name="logo"
                  onChange={(e) => onImageChange(e, "logo")}
                  accept="image/*"
                />
              </Label>

              <Label className="relative flex flex-col gap-1 outline-none group">
                <span className="text-xs font-medium">Image 1 (max. 2MB)</span>
                <InputFile
                  preview={preview.galleryUrls?.[0]}
                  alt="gallery 1"
                  name="gallery"
                  onChange={(e) => onImageChange(e, "gallery", 0)}
                  accept="image/*"
                />
              </Label>

              <Label className="relative flex flex-col gap-1 outline-none group">
                <span className="text-xs font-medium">Image 2 (max. 2MB)</span>
                <InputFile
                  preview={preview.galleryUrls?.[1]}
                  alt="gallery 2"
                  name="gallery"
                  onChange={(e) => onImageChange(e, "gallery", 1)}
                  accept="image/*"
                />
              </Label>
            </div>
          </fieldset>

          <Separator.Root className="h-px bg-border my-4" />

          <div className="flex gap-2 justify-end">
            {/* <button
              type="button"
              className="bg-secondary text-secondary-foreground px-3 py-2 rounded-sm font-light text-xs disabled:opacity-50 cursor-pointer hover:bg-secondary/90 transition-colors"
              onClick={onPreview}
            >
              Prévisualiser
            </button> */}

            <button
              type="submit"
              className="bg-primary text-primary-foreground px-3 py-2 rounded-sm font-light text-xs disabled:opacity-50 cursor-pointer hover:bg-primary/90 transition-colors"
              disabled={isPending}
            >
              {isPending ? <Loader className="size-4 animate-spin" /> : "Référencer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
