import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { absoluteUrl } from "~/lib/seo";
import { slugify } from "~/utils/slug";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const db = getDb();
        const [categories, companies] = await Promise.all([
          db
            .select({ name: categoriesTable.name, updated_at: categoriesTable.updated_at })
            .from(categoriesTable)
            .where(eq(categoriesTable.is_active, true)),
          db
            .select({ slug: companiesTable.slug, updated_at: companiesTable.updated_at })
            .from(companiesTable)
            .where(eq(companiesTable.status, "active")),
        ]);

        const urls = [
          { loc: absoluteUrl("/"), priority: "1.0" },
          { loc: absoluteUrl("/about"), priority: "0.7" },
          { loc: absoluteUrl("/faq"), priority: "0.7" },
          { loc: absoluteUrl("/partners"), priority: "0.6" },
          { loc: absoluteUrl("/sources"), priority: "0.6" },
          { loc: absoluteUrl("/cgu"), priority: "0.3" },
          ...categories.map((category) => ({
            loc: absoluteUrl(`/categories/${slugify(category.name)}`),
            lastmod: category.updated_at,
            priority: "0.8",
          })),
          ...companies.map((company) => ({
            loc: absoluteUrl(`/entreprises/${company.slug}`),
            lastmod: company.updated_at,
            priority: "0.9",
          })),
        ];

        return new Response(renderSitemap(urls), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
            "Cloudflare-CDN-Cache-Control": "max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});

function renderSitemap(
  urls: Array<{ loc: string; lastmod?: Date | string; priority?: string }>,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>${
        url.lastmod ? `\n    <lastmod>${formatDate(url.lastmod)}</lastmod>` : ""
      }${url.priority ? `\n    <priority>${url.priority}</priority>` : ""}\n  </url>`,
    )
    .join("\n")}\n</urlset>`;
}

function formatDate(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
