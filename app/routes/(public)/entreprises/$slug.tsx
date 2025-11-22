import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon, Globe, Mail, PencilLine, Phone } from "lucide-react";
import { useState } from "react";
import { CompanyLogo } from "~/components/company-logo";
import { CopyButton } from "~/components/copy-button";
import { CalendlyIcon } from "~/components/icons/calendly";
import { FacebookIcon } from "~/components/icons/facebook";
import { InstagramIcon } from "~/components/icons/instagram";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { SpotifyIcon } from "~/components/icons/spotify";
import { TiktokIcon } from "~/components/icons/tiktok";
import { TwitterIcon } from "~/components/icons/twitter";
import { YoutubeIcon } from "~/components/icons/youtube";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { cn } from "~/utils/cn";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/(public)/entreprises/$slug")({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error</div>,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(companyBySlugQuery(params.slug));
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
  youtube: <YoutubeIcon className="size-5" />,
  tiktok: <TiktokIcon className="size-5" />,
  twitter: <TwitterIcon className="size-5" />,
  spotify: <SpotifyIcon className="size-5" />,
} as const;

function RouteComponent() {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const { data } = useSuspenseQuery(companyBySlugQuery(params.slug));

  if (!data) return <div>Company not found</div>;

  const hasSocialMedia = Object.keys(data.social_media).length > 0;

  const isOwner = context.user?.id === data.user_id;
  const isAdmin = context.user?.role === "admin";

  return (
    <main className="px-4 py-8">
      <div className="grid gap-4 max-w-5xl mx-auto py-24">
        <div className="flex flex-col md:flex-row gap-4">
          {data.logo?.secureUrl ? (
            <div className="border border-border bg-card p-6 rounded-sm grid place-items-center">
              <CompanyLogo url={data.logo?.secureUrl} name={data.name} size="lg" />
            </div>
          ) : null}

          <div className="flex-1 flex flex-col gap-2 border border-border bg-card text-card-foreground p-6 rounded-sm">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <CopyButton>{data.siret}</CopyButton>
              {isOwner ||
                (isAdmin && (
                  <Link
                    to={"/compte/entreprises/$slug/edit/infos"}
                    params={{ slug: params.slug }}
                    search={{ id: context?.user?.id ?? "" }}
                    className="border border-border bg-muted text-muted-foreground px-2 py-1 rounded-sm text-xs h-min flex items-center gap-1"
                  >
                    <span>Modifier</span>
                    <PencilLine className="size-4" />
                  </Link>
                ))}
            </div>

            <ul className="flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <li
                  key={category?.id}
                  className="bg-accent text-accent-foreground px-2 py-1 rounded-sm text-xs"
                >
                  <Link
                    to="/categories/$slug"
                    params={{ slug: slugify(category?.name ?? "") }}
                    search={{ id: category?.id ?? "", name: category?.name ?? "" }}
                  >
                    {category?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 border border-border bg-card text-card-foreground p-6 rounded-sm flex flex-col gap-2">
            <p className="text-sm text-nowrap">
              <span className="font-bold">Entrepreneur·euse :</span> {data.business_owner || "..."}
            </p>
            <p className="text-sm">
              <span className="font-bold">Zone géographique :</span> {data.service_area || "..."}
            </p>
            <p className="text-sm text-nowrap">
              <span className="font-bold">Mode de travail :</span>{" "}
              {WORK_MODES[data.work_mode ?? "not_specified"]}
            </p>

            {data.rqth ? (
              <p className="text-sm text-nowrap">
                <span className="font-bold">RQTH:</span> Oui
              </p>
            ) : null}

            <p className="text-sm">
              <span className="font-bold">Activités :</span> {data.subdomain || "..."}
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-4 border border-border bg-card text-card-foreground p-6 rounded-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail className="size-5" />
                <a href={`mailto:${data.email}`} className="text-xs text-nowrap">
                  {data.email || "..."}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="size-5" />
                <a href={`tel:${data.phone}`} className="text-xs text-nowrap">
                  {data.phone || "..."}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="size-5" />
                {data.website ? (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-nowrap"
                  >
                    {data.website}
                  </a>
                ) : (
                  <span className="text-xs text-nowrap">...</span>
                )}
              </div>
            </div>

            {hasSocialMedia ? (
              <ul className="flex gap-2">
                {Object.entries(data.social_media).map(([key, value]) => (
                  <li key={key}>
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {SOCIAL_MEDIA_ICONS[key as keyof typeof SOCIAL_MEDIA_ICONS]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="border border-border bg-card text-card-foreground px-6 py-8 rounded-sm grid gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold tracking-tighter">Description</h2>
            <p className="text-sm text-pretty whitespace-pre-line leading-relaxed">
              {data.description || "Non renseigné"}
            </p>
          </div>
        </div>

        {data.gallery?.length ? <GalleryImages gallery={data.gallery} /> : null}
      </div>
    </main>
  );
}

function GalleryImages({ gallery }: { gallery: Array<{ secureUrl: string; publicId: string }> }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="border border-border bg-card text-card-foreground p-6 rounded-sm grid gap-4">
      <h2 className="sr-only">Galerie</h2>
      <ul className="flex flex-wrap gap-4 items-center justify-center">
        {gallery.map((image, index) => {
          return (
            <li key={image.publicId}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="grid place-items-center size-64 cursor-zoom-in"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image.secureUrl}
                      alt={image.publicId}
                      className="object-contain aspect-square rounded-sm"
                    />
                  </button>
                </DialogTrigger>

                <DialogContent className="w-auto px-8 py-16">
                  <DialogTitle className="sr-only">
                    {gallery[currentImageIndex].publicId}
                  </DialogTitle>

                  <DialogDescription className="sr-only">
                    Galerie d'image de l'entreprise
                  </DialogDescription>

                  <div className="flex gap-8 justify-between items-center">
                    <button
                      type="button"
                      className={cn(
                        "bg-secondary/80 text-secondary-foreground rounded-full p-2 hover:bg-secondary/90 size-8 grid place-items-center cursor-pointer",
                        gallery.length <= 1 && "hidden",
                      )}
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                      }
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="size-4" />
                    </button>

                    <img
                      src={gallery[currentImageIndex].secureUrl}
                      alt={gallery[currentImageIndex].publicId}
                      className="w-[25vw] max-w-full object-contain"
                    />

                    <button
                      type="button"
                      className={cn(
                        "bg-secondary/80 text-secondary-foreground rounded-full p-2 hover:bg-secondary/90 size-8 grid place-items-center cursor-pointer",
                        gallery.length <= 1 && "hidden",
                      )}
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
                      }
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
