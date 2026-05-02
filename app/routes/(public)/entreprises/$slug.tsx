import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon, Globe, Mail, Phone } from "lucide-react";
import { useState } from "react";
import banner from "~/assets/img/banniere.png?url";
import logo from "~/assets/img/Logo vecto_png.png?url";
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
import { seo } from "~/lib/seo";
import { cn } from "~/utils/cn";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/(public)/entreprises/$slug")({
  head: ({ params }) =>
    seo({
      title: params.slug,
      description:
        "Fiche entreprise TIH : activité, coordonnées, zone géographique et informations professionnelles.",
      path: `/entreprises/${params.slug}`,
    }),
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

const SOCIAL_MEDIA_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  calendly: "Calendly",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X / Twitter",
  spotify: "Spotify",
} as const;

function RouteComponent() {
  const params = Route.useParams();
  const router = useRouter();
  const { data } = useSuspenseQuery(companyBySlugQuery(params.slug));

  if (!data) return <div>Company not found</div>;

  const hasSocialMedia = Object.keys(data.social_media).length > 0;

  return (
    <main className="bg-background text-foreground">
      <section className="pt-16 text-center md:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-10 md:pb-12">
          <img src={logo} alt="Annuaire TIH" className="mb-8 h-32 w-auto md:h-44" />
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Annuaire - TIH</h1>
          <p className="mt-5 text-2xl font-light md:text-4xl">
            Votre réseau de prestataires indépendants TIH*.
          </p>
        </div>

        <img
          src={banner}
          alt="Illustration Annuaire TIH"
          className="h-40 w-full object-cover object-center md:h-72"
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <div className="grid gap-8">
          <div className="grid items-end gap-8 md:grid-cols-[16rem_1fr]">
            {data.logo?.secureUrl ? (
              <div className="grid aspect-square place-items-center bg-card p-6">
                <CompanyLogo url={data.logo.secureUrl} name={data.name} size="lg" />
              </div>
            ) : null}

            <div className="grid gap-4">
              <ul className="flex flex-wrap gap-2">
                {data.categories.map((category) => (
                  <li key={category?.id}>
                    <Link
                      to="/categories/$slug"
                      params={{ slug: slugify(category?.name ?? "") }}
                      search={{ id: category?.id ?? "", name: category?.name ?? "" }}
                      className="inline-flex bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                    >
                      {category?.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight">{data.name}</h2>
                  <CopyButton>{data.siret}</CopyButton>
                </div>
                <p className="text-sm">{data.siret}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_17rem]">
            <div className="bg-primary p-5 text-primary-foreground">
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="inline font-bold">Entrepreneur·euse : </dt>
                  <dd className="inline">{data.business_owner || "..."}</dd>
                </div>
                <div>
                  <dt className="inline font-bold">Zone géographique : </dt>
                  <dd className="inline">{data.service_area || "..."}</dd>
                </div>
                <div>
                  <dt className="inline font-bold">Mode de travail : </dt>
                  <dd className="inline">{WORK_MODES[data.work_mode ?? "not_specified"]}</dd>
                </div>
                {data.rqth ? (
                  <div>
                    <dt className="inline font-bold">RQTH : </dt>
                    <dd className="inline">Oui</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="inline font-bold">Sous domaine : </dt>
                  <dd className="inline">{data.subdomain || "..."}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-primary p-5 text-primary-foreground">
              <h3 className="mb-4 text-sm font-bold">Contacts :</h3>
              <div className="grid gap-4 text-sm">
                <a href={`mailto:${data.email}`} className="flex items-center gap-3">
                  <Mail className="size-7" />
                  <span>{data.email || "..."}</span>
                </a>
                <a href={`tel:${data.phone}`} className="flex items-center gap-3">
                  <Phone className="size-7" />
                  <span>{data.phone || "..."}</span>
                </a>
                <div className="flex items-center gap-3">
                  <Globe className="size-7" />
                  {data.website ? (
                    <a href={data.website} target="_blank" rel="noopener noreferrer">
                      {data.website}
                    </a>
                  ) : (
                    <span>...</span>
                  )}
                </div>
              </div>

              {hasSocialMedia ? (
                <ul className="mt-5 flex gap-2" aria-label="Réseaux sociaux">
                  {Object.entries(data.social_media).map(([key, value]) => {
                    const mediaKey = key as keyof typeof SOCIAL_MEDIA_ICONS;

                    return (
                      <li key={key}>
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${SOCIAL_MEDIA_LABELS[mediaKey]} de ${data.name}`}
                          className="inline-flex size-6 items-center justify-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {SOCIAL_MEDIA_ICONS[mediaKey]}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 text-sm leading-snug">
            <h3 className="font-bold">Informations :</h3>
            <p className="whitespace-pre-line">{data.description || "Non renseigné"}</p>
          </div>

          {data.gallery?.length ? (
            <GalleryImages gallery={data.gallery} companyName={data.name} />
          ) : null}

          <div className="flex flex-col justify-center gap-6 pt-10 sm:flex-row">
            <button
              type="button"
              onClick={() => router.history.back()}
              className="inline-flex h-14 min-w-56 items-center justify-center bg-secondary px-8 text-sm uppercase text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Page précédente
            </button>
            <Link
              to="/"
              hash="categories"
              className="inline-flex h-14 min-w-56 items-center justify-center bg-secondary px-8 text-sm uppercase text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Revenir aux catégories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function GalleryImages({
  gallery,
  companyName,
}: {
  gallery: Array<{ secureUrl: string; publicId: string }>;
  companyName: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="border-8 border-primary p-10">
      <h2 className="sr-only">Galerie</h2>
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {gallery.map((image, index) => {
          return (
            <li key={image.publicId}>
              <Dialog>
                <DialogTrigger
                  render={
                    <button
                      type="button"
                      className="grid size-64 cursor-zoom-in place-items-center"
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  }
                >
                  <img
                    src={image.secureUrl}
                    alt={`Galerie ${index + 1} de ${companyName}`}
                    className="aspect-square object-contain"
                  />
                </DialogTrigger>

                <DialogContent className="w-auto px-8 py-16">
                  <DialogTitle className="sr-only">
                    {gallery[currentImageIndex].publicId}
                  </DialogTitle>

                  <DialogDescription className="sr-only">
                    Galerie d'image de l'entreprise
                  </DialogDescription>

                  <div className="flex items-center justify-between gap-8">
                    <button
                      type="button"
                      className={cn(
                        "grid size-8 cursor-pointer place-items-center rounded-full bg-secondary/80 p-2 text-secondary-foreground hover:bg-secondary/90",
                        gallery.length <= 1 && "hidden",
                      )}
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                      }
                      aria-label="Image précédente"
                    >
                      <ChevronLeftIcon className="size-4" />
                    </button>

                    <img
                      src={gallery[currentImageIndex].secureUrl}
                      alt={`Galerie ${currentImageIndex + 1} de ${companyName}`}
                      className="w-[25vw] max-w-full object-contain"
                    />

                    <button
                      type="button"
                      className={cn(
                        "grid size-8 cursor-pointer place-items-center rounded-full bg-secondary/80 p-2 text-secondary-foreground hover:bg-secondary/90",
                        gallery.length <= 1 && "hidden",
                      )}
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
                      }
                      aria-label="Image suivante"
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
