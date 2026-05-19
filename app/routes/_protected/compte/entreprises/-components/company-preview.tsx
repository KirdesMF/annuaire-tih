import { Link } from "@tanstack/react-router";
import { Globe, Mail, Phone } from "lucide-react";
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
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Category } from "~/db/schema/categories";

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

type SocialKey = keyof typeof SOCIAL_MEDIA_ICONS;

type PreviewData = {
  name: string;
  siret: string;
  categories: string[];
  business_owner?: string | null;
  description?: string | null;
  website?: string | null;
  service_area?: string | null;
  subdomain?: string | null;
  email?: string | null;
  phone?: string | null;
  work_mode?: keyof typeof WORK_MODES | null;
  rqth?: boolean | null;
  social_media?: Partial<Record<SocialKey, string>> | null;
};

export function CompanyPreview({
  title,
  backTo,
  backParams,
  backSearch,
  submitLabel,
  pendingLabel,
  isPending,
  onConfirm,
  preview,
  categories,
  logoUrl,
  galleryUrls,
}: {
  title: string;
  backTo: string;
  backParams?: Record<string, string>;
  backSearch?: Record<string, unknown>;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onConfirm: () => void;
  preview: PreviewData;
  categories: Category[];
  logoUrl?: string;
  galleryUrls?: string[];
}) {
  const socialMediaEntries = Object.entries(preview.social_media ?? {}).filter(
    ([, value]) => typeof value === "string" && value.length > 0,
  ) as Array<[SocialKey, string]>;

  return (
    <main className="px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-4">
        <Link
          to={backTo}
          params={backParams}
          search={backSearch}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Retour
        </Link>

        <Card>
          <CardContent className="flex flex-col gap-4 pt-4 md:flex-row md:items-start">
            <div className="shrink-0">
              <CompanyLogo url={logoUrl} name={preview.name} size="lg" />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{preview.name}</h1>
                <CopyButton>{preview.siret}</CopyButton>
              </div>

              {preview.categories.length ? (
                <ul className="flex flex-wrap gap-2">
                  {preview.categories.map((categoryId) => {
                    const category = categories.find((item) => item.id === categoryId);
                    if (!category) return null;

                    return (
                      <li
                        key={category.id}
                        className="rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      >
                        <span className="max-w-[30ch] truncate">{category.name}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-2 md:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Mail className="size-5" aria-hidden />
                  <p className="text-xs text-muted-foreground">
                    {preview.email || "Non renseigné"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="size-5" aria-hidden />
                  <p className="text-xs text-muted-foreground">
                    {preview.phone || "Non renseigné"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="size-5" aria-hidden />
                  {preview.website ? (
                    <a
                      href={preview.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground underline underline-offset-4"
                    >
                      {preview.website}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Non renseigné</span>
                  )}
                </div>
              </div>

              {socialMediaEntries.length ? (
                <ul className="flex gap-2" aria-label="Réseaux sociaux">
                  {socialMediaEntries.map(([key, value]) => (
                    <li key={key}>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${SOCIAL_MEDIA_LABELS[key]} de ${preview.name}`}
                        className="inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {SOCIAL_MEDIA_ICONS[key]}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2 pt-4">
              <p className="text-sm">
                <span className="font-bold">Entrepreneur :</span>{" "}
                {preview.business_owner || "Non renseigné"}
              </p>
              <p className="text-sm">
                <span className="font-bold">Zone géographique :</span>{" "}
                {preview.service_area || "Non renseigné"}
              </p>
              <p className="text-sm">
                <span className="font-bold">Mode de travail :</span>{" "}
                {WORK_MODES[preview.work_mode ?? "not_specified"]}
              </p>
              <p className="text-sm">
                <span className="font-bold">RQTH :</span> {preview.rqth ? "Oui" : "Non"}
              </p>
              <p className="text-sm">
                <span className="font-bold">Activité :</span> {preview.subdomain || "Non renseigné"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pb-4">
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {preview.description || "Non renseigné"}
            </p>

            {galleryUrls?.length ? (
              <>
                <Separator />
                <ul className="flex flex-wrap gap-2">
                  {galleryUrls.map((url, index) => (
                    <li key={url}>
                      <img
                        src={url}
                        alt={`${index + 1} de la galerie de ${preview.name}`}
                        className="size-16 rounded-sm object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>

          <div className="flex gap-2">
            <Link to={backTo} params={backParams} search={backSearch}>
              <Button variant="outline">Retour</Button>
            </Link>
            <Button onClick={onConfirm} disabled={isPending}>
              {isPending ? pendingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
