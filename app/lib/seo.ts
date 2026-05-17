const SITE_URL = "https://annuaire-tih.fr";
const SITE_NAME = "Annuaire TIH";
const DEFAULT_DESCRIPTION =
  "Découvrez des entrepreneur·euses et entreprises TIH, avec recherche par activité, catégorie et zone géographique.";

type SeoOptions = {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

function pageTitle(title?: string) {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

export function seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  noIndex = false,
}: SeoOptions = {}) {
  const fullTitle = pageTitle(title);
  const url = absoluteUrl(path);

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      ...(noIndex ? [{ name: "robots", content: "noindex,nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export { absoluteUrl, DEFAULT_DESCRIPTION, pageTitle, SITE_NAME, SITE_URL };
