import { d, l } from './index-8Htcofqc.mjs';
import { d as d$1 } from './categories-BGVwlHfX.mjs';
import { p, N } from './company-categories-Dsd3WCXy.mjs';
import { y as y$1 } from './auth.server-CEln8Kin.mjs';
import { eq, desc, inArray } from 'drizzle-orm';
import { redirect } from '@tanstack/react-router';
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

const y = d("app_lib_api_user_ts--getUserCompanies_createServerFn_handler", "/_server", (r, o) => b.__executeServer(r, o)), b = createServerFn({ method: "GET" }).handler(y, async () => {
  const r = getWebRequest();
  if (!r) return;
  const o = await y$1.api.getSession({ headers: r.headers });
  if (!o) throw redirect({ to: "/login" });
  const s = await l.select({ id: p.id, name: p.name, description: p.description, status: p.status, siret: p.siret, business_owner: p.business_owner, website: p.website, service_area: p.service_area, subdomain: p.subdomain, email: p.email, phone: p.phone, work_mode: p.work_mode, rqth: p.rqth, logo: p.logo, gallery: p.gallery }).from(p).where(eq(p.user_id, o.user.id)).orderBy(desc(p.created_at)), p$1 = await l.select({ company_id: N.company_id, category_id: d$1.id, category_name: d$1.name }).from(N).leftJoin(d$1, eq(d$1.id, N.category_id)).where(inArray(N.company_id, s.map((t) => t.id)));
  return s.map((t) => ({ ...t, categories: p$1.filter((c) => c.company_id === t.id) }));
});

export { y as getUserCompanies_createServerFn_handler };
//# sourceMappingURL=user-DodAozgJ.mjs.map
