import { eq } from 'drizzle-orm';
import { d, l } from './index-8Htcofqc.mjs';
import { p, N as N$1, h } from './company-categories-Dsd3WCXy.mjs';
import * as e from 'valibot';
import { y } from './auth.server-CEln8Kin.mjs';
import { redirect } from '@tanstack/react-router';
import { v2 } from 'cloudinary';
import { decode } from 'decode-formdata';
import { d as d$1 } from './categories-BGVwlHfX.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import { getWebRequest } from '@tanstack/start-server-core';
import 'tiny-invariant';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'dotenv';
import 'drizzle-orm/pg-core';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';
import 'better-auth/react-start';

const O = e.object({ name: e.pipe(e.string(), e.nonEmpty("Veuillez entrer le nom de l'entreprise"), e.maxLength(255, "Le nom de l'entreprise doit contenir au plus 255 caract\xE8res")), siret: e.pipe(e.string(), e.nonEmpty("Veuillez entrer le siret de l'entreprise"), e.length(14, "Le siret de l'entreprise doit contenir 14 caract\xE8res")), categories: e.pipe(e.array(e.string()), e.minLength(1, "Veuillez s\xE9lectionner au moins une cat\xE9gorie"), e.maxLength(3, "Veuillez s\xE9lectionner au plus 3 cat\xE9gories")), business_owner: e.union([e.literal(""), e.pipe(e.string(), e.nonEmpty("Veuillez entrer le nom du responsable de l'entreprise"), e.maxLength(255, "Le nom du responsable de l'entreprise doit contenir au plus 255 caract\xE8res"))]), description: e.union([e.literal(""), e.pipe(e.string(), e.maxLength(1500, "La description de l'entreprise doit contenir au plus 1500 caract\xE8res"))]), website: e.union([e.literal(""), e.pipe(e.string(), e.url("Veuillez entrer une url valide"))]), location: e.optional(e.union([e.literal(""), e.pipe(e.string(), e.maxLength(255, "La localisation doit contenir au plus 255 caract\xE8res"))])), service_area: e.union([e.literal(""), e.pipe(e.string(), e.maxLength(255, "La zone de service doit contenir au plus 255 caract\xE8res"))]), subdomain: e.union([e.literal(""), e.pipe(e.string(), e.maxLength(100, "Le sous-domaine doit contenir au plus 100 caract\xE8res"))]), email: e.union([e.literal(""), e.pipe(e.string(), e.email("Veuillez entrer une adresse email valide"))]), phone: e.union([e.literal(""), e.pipe(e.string(), e.maxLength(24, "Le num\xE9ro de t\xE9l\xE9phone doit contenir au plus 24 caract\xE8res"))]), work_mode: e.nullable(e.picklist(h)), rqth: e.optional(e.boolean()), logo: e.optional(e.pipe(e.instance(File), e.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"], "Veuillez entrer un fichier valide pour le logo"), e.maxSize(1024 * 1024 * 3, "La taille du fichier doit \xEAtre inf\xE9rieure \xE0 3MB"))), gallery: e.optional(e.pipe(e.array(e.pipe(e.instance(File), e.mimeType(["image/png", "image/jpeg", "image/jpg", "image/webp"], "Veuillez entrer un fichier valide pour la galerie"), e.maxSize(1024 * 1024 * 2, "La taille du fichier doit \xEAtre inf\xE9rieure \xE0 2MB"))), e.maxLength(2, "Veuillez entrer au plus 2 images"))), facebook: e.union([e.literal(""), e.pipe(e.string(), e.url("Veuillez entrer une url valide"), e.startsWith("https://www.facebook.com/", "Veuillez entrer une url facebook valide"))]), instagram: e.union([e.literal(""), e.pipe(e.string(), e.url("Veuillez entrer une url valide"), e.startsWith("https://www.instagram.com/", "Veuillez entrer une url instagram valide"))]), linkedin: e.union([e.literal(""), e.pipe(e.string(), e.url("Veuillez entrer une url valide"), e.startsWith("https://www.linkedin.com/company/", "Veuillez entrer une url linkedin valide"))]), calendly: e.union([e.literal(""), e.pipe(e.string(), e.url("Veuillez entrer une url valide"), e.startsWith("https://calendly.com/", "Veuillez entrer une url calendly valide"))]) });
v2.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
async function C({ type: r, file: i, companyId: o, companyName: a }) {
  const c = r === "logo" ? `companies/${a}/logo` : `companies/${a}/gallery`;
  try {
    const u = await i.arrayBuffer();
    return await new Promise((y, f) => {
      v2.uploader.upload_stream({ folder: c, resource_type: "auto", public_id: `${o}-${Date.now()}`, allowed_formats: ["jpg", "png", "jpeg", "webp"] }, (g, d) => {
        g && f(g), d && y({ secure_url: d.secure_url, public_id: d.public_id });
      }).end(Buffer.from(u));
    });
  } catch (u) {
    throw console.error(u), new Error("Failed to upload image to Cloudinary");
  }
}
const A = d("app_lib_api_companies_ts--addCompany_createServerFn_handler", "/_server", (r, i) => D.__executeServer(r, i)), R = d("app_lib_api_companies_ts--deleteCompany_createServerFn_handler", "/_server", (r, i) => q.__executeServer(r, i)), j = d("app_lib_api_companies_ts--getCompany_createServerFn_handler", "/_server", (r, i) => N.__executeServer(r, i)), D = createServerFn({ method: "POST" }).validator((r) => {
  const i = decode(r, { files: ["logo", "gallery"], arrays: ["categories", "gallery"], booleans: ["rqth"] });
  return e.parse(O, i);
}).handler(A, async ({ data: r }) => {
  const i = getWebRequest();
  if (!i) throw new Error("Request not found");
  const o = await y.api.getSession({ headers: i.headers });
  if (!o) throw redirect({ to: "/login" });
  const { logo: a, gallery: c, categories: u, facebook: L, instagram: y$1, linkedin: f, calendly: g, ...d } = r;
  try {
    await l.transaction(async (s) => {
      const [l] = await s.insert(p).values({ ...d, social_media: { facebook: L, instagram: y$1, linkedin: f, calendly: g }, user_id: o.user.id, created_by: o.user.id }).returning();
      if (a && a.size > 0) {
        const t = await C({ file: a, companyId: l.id, companyName: l.name, type: "logo" });
        if (t instanceof Error) throw t;
        const { secure_url: w, public_id: m } = t;
        await s.update(p).set({ logo: { secureUrl: w, publicId: m } }).where(eq(p.id, l.id));
      }
      if (c && c.length > 0) {
        const t = [];
        for (const w of c) {
          if (t.length >= 2) break;
          const m = await C({ file: w, companyId: l.id, companyName: l.name, type: "gallery" });
          if (m instanceof Error) throw m;
          const { secure_url: V, public_id: E } = m;
          t.push({ secureUrl: V, publicId: E });
        }
        await s.update(p).set({ gallery: t }).where(eq(p.id, l.id));
      }
      await s.insert(N$1).values(u.map((t) => ({ company_id: l.id, category_id: t })));
    });
  } catch (s) {
    console.error(s);
  }
}), q = createServerFn({ method: "POST" }).validator((r) => r).handler(R, async ({ data: r }) => {
  try {
    await l.delete(p).where(eq(p.id, r));
  } catch (i) {
    console.error(i);
  }
}), N = createServerFn({ method: "GET" }).validator((r) => r).handler(j, async ({ data: r }) => {
  try {
    const i = await l.select().from(p).where(eq(p.id, r)).limit(1).then((a) => a[0]), o = await l.select().from(N$1).leftJoin(d$1, eq(d$1.id, N$1.category_id)).where(eq(N$1.company_id, i.id));
    return { ...i, categories: o.map((a) => {
      var _a;
      return (_a = a.categories) == null ? void 0 : _a.name;
    }) };
  } catch (i) {
    console.error(i);
  }
});

export { A as addCompany_createServerFn_handler, R as deleteCompany_createServerFn_handler, j as getCompany_createServerFn_handler };
//# sourceMappingURL=companies-Co9WOiyO.mjs.map
