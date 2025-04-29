import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CompanyLogo } from "~/components/company-logo";
import { CopyButton } from "~/components/copy-button";
import { CalendlyIcon } from "~/components/icons/calendly";
import { EmailIcon } from "~/components/icons/email";
import { FacebookIcon } from "~/components/icons/facebook";
import { GlobeIcon } from "~/components/icons/globe";
import { InstagramIcon } from "~/components/icons/instagram";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { PhoneIcon } from "~/components/icons/phone";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import { slugify } from "~/utils/slug";
import type { Entries } from "~/utils/types";

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
} as const;

function RouteComponent() {
  const params = Route.useParams();
  const context = Route.useRouteContext();
  const { data } = useSuspenseQuery(companyBySlugQuery(params.slug));

  if (!data) return <div>Company not found</div>;

  const isSocialMediaEmpty = Object.values(data.social_media).every((value) => value === "");

  return (
    <main className="px-4 py-8 grid gap-4">
      <div className="container flex justify-between gap-4 border border-gray-300 p-6 rounded-sm">
        <div className="flex flex-col gap-2">
          <div className="size-24">
            <CompanyLogo url={data.logo?.secureUrl} name={data.name} size="lg" />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <CopyButton>{data.siret}</CopyButton>
            {context.user?.id === data.user_id && (
              <Link
                to={"/compte/entreprises/$slug/edit/infos"}
                params={{ slug: params.slug }}
                className="border border-gray-300 px-2 py-1 rounded-sm text-xs h-min"
              >
                Edit
              </Link>
            )}
          </div>
          <ul className="flex flex-wrap gap-2">
            {data.categories.map((category) => (
              <li key={category?.id} className="bg-gray-100 px-2 py-1 rounded-sm text-xs">
                <Link
                  to="/categories/$slug"
                  params={{ slug: slugify(category?.name ?? "") }}
                  search={{ id: category?.id ?? "" }}
                >
                  {category?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container flex gap-2 flex-wrap">
        <div className="flex-1 flex flex-col justify-center gap-4 border border-gray-300 p-6 rounded-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <EmailIcon className="size-5" />
              <p className="text-xs text-gray-500 text-nowrap">{data.email || "Non renseigné"}</p>
            </div>

            <div className="flex items-center gap-2">
              <PhoneIcon className="size-5" />
              <p className="text-xs text-gray-500 text-nowrap">{data.phone || "Non renseigné"}</p>
            </div>

            <div className="flex items-center gap-2">
              <GlobeIcon className="size-5" />
              {data.website ? (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 text-nowrap"
                >
                  {data.website}
                </a>
              ) : (
                <span className="text-xs text-gray-500 text-nowrap">Non renseigné</span>
              )}
            </div>
          </div>

          {!isSocialMediaEmpty ? (
            <ul className="flex gap-2">
              {(Object.entries(data.social_media || {}) as Entries<typeof data.social_media>).map(
                ([key, value]) => (
                  <li key={key}>
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {SOCIAL_MEDIA_ICONS[key]}
                    </a>
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </div>

        <div className="flex-1 border border-gray-300 p-6 rounded-sm flex flex-col gap-2">
          <p className="text-sm text-gray-500 text-nowrap">
            <span className="font-bold">Entrepreneur:</span>{" "}
            {data.business_owner || "Non renseigné"}
          </p>
          <p className="text-sm text-gray-500 text-nowrap">
            <span className="font-bold">Zone géographique:</span>{" "}
            {data.service_area || "Non renseigné"}
          </p>
          <p className="text-sm text-gray-500 text-nowrap">
            <span className="font-bold">Mode de travail:</span>{" "}
            {WORK_MODES[data.work_mode ?? "not_specified"]}
          </p>
          <p className="text-sm text-gray-500 text-nowrap">
            <span className="font-bold">RQTH:</span> {data.rqth ? "Oui" : "Non"}
          </p>
          <p className="text-sm text-gray-500 text-nowrap">
            <span className="font-bold">Sous domaine:</span> {data.subdomain || "Non renseigné"}
          </p>
        </div>
      </div>

      <div className="container border border-gray-300 p-6 rounded-sm grid gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Description</h2>
          <p className="text-sm text-gray-500 text-pretty whitespace-pre-line">
            {data.description || "Non renseigné"}
          </p>
        </div>
      </div>

      {data.gallery?.length ? <GalleryImages gallery={data.gallery} /> : null}
    </main>
  );
}

function GalleryImages({ gallery }: { gallery: Array<{ secureUrl: string; publicId: string }> }) {
  return (
    <div className="container border border-gray-300 p-6 rounded-sm grid gap-4">
      <h2 className="text-lg font-bold">Galerie</h2>
      <ul className="flex flex-wrap gap-4 items-center justify-center">
        {gallery.map((image) => {
          return (
            <li key={image.publicId}>
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="grid place-items-center cursor-pointer size-64">
                    <img
                      src={image.secureUrl}
                      alt={image.publicId}
                      className="object-contain rounded-sm"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="w-auto p-16">
                  <DialogTitle className="sr-only">{image.publicId}</DialogTitle>
                  <div className="grid place-items-center">
                    <img
                      src={image.secureUrl}
                      alt={image.publicId}
                      className="max-h-[70vh] max-w-full object-contain"
                    />
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
