import { createFileRoute, Link } from "@tanstack/react-router";
import { companyBySlugQuery } from "~/lib/api/companies/queries/get-company-by-slug";
import * as v from "valibot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CopyButton } from "~/components/copy-button";
import { CompanyLogo } from "~/components/company-logo";
import { FacebookIcon } from "~/components/icons/facebook";
import { InstagramIcon } from "~/components/icons/instagram";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { CalendlyIcon } from "~/components/icons/calendly";
import type { Entries } from "~/utils/types";
import { Separator } from "radix-ui";
import { EmailIcon } from "~/components/icons/email";
import { PhoneIcon } from "~/components/icons/phone";
import { GlobeIcon } from "~/components/icons/globe";
import { LinkChainIcon } from "~/components/icons/link-chain";

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
          <CompanyLogo url={data.logo?.secureUrl} name={data.name} size="lg" />
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
            {data.categories?.map((category) => (
              <li key={category?.id} className="bg-gray-100 px-2 py-1 rounded-sm text-xs">
                {category?.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2">
          <button type="button" className="bg-gray-100 p-2 rounded-sm cursor-pointer h-min">
            <LinkChainIcon className="size-5" />
          </button>
        </div>
      </div>

      <div className="container flex gap-2">
        <div className="flex-1 flex flex-col justify-center gap-4 border border-gray-300 p-6 rounded-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <EmailIcon className="size-5" />
              <p className="text-xs text-gray-500">{data.email || "Non renseigné"}</p>
            </div>

            <div className="flex items-center gap-2">
              <PhoneIcon className="size-5" />
              <p className="text-xs text-gray-500">{data.phone || "Non renseigné"}</p>
            </div>

            <div className="flex items-center gap-2">
              <GlobeIcon className="size-5" />
              {data.website ? (
                <a href={data.website} target="_blank" rel="noopener noreferrer">
                  {data.website}
                </a>
              ) : (
                <span className="text-xs text-gray-500">Non renseigné</span>
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
          <p className="text-sm text-gray-500">
            <span className="font-bold">Entrepreneur:</span>{" "}
            {data.business_owner || "Non renseigné"}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Zone géographique:</span>{" "}
            {data.service_area || "Non renseigné"}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">Mode de travail:</span>{" "}
            {WORK_MODES[data.work_mode ?? "not_specified"]}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-bold">RQTH:</span> {data.rqth ? "Oui" : "Non"}
          </p>
          <p className="text-sm text-gray-500">
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

        {data.gallery?.length ? (
          <>
            <Separator.Root className="h-px bg-gray-300 my-4" />

            <ul className="flex flex-wrap gap-2">
              {data.gallery?.map((image) => (
                <li key={image.publicId}>
                  <img
                    src={image.secureUrl}
                    alt={data.name}
                    className="size-16 aspect-square rounded-sm"
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </main>
  );
}
