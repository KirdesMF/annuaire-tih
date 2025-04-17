import E from 'tiny-invariant';
import { drizzle } from 'drizzle-orm/postgres-js';
import i from 'postgres';
import { config } from 'dotenv';

function c(r) {
  return r.replace(/^\/|\/$/g, "");
}
const d = (r, t, e) => {
  E(e, "\u{1F6A8}splitImportFn required for the server functions server runtime, but was not provided.");
  const o = `/${c(t)}/${r}`;
  return Object.assign(e, { url: o, functionId: r });
};
config({ path: ".env" });
const p = i(process.env.DATABASE_URL, { prepare: false }), l = drizzle({ client: p });

export { d, l };
//# sourceMappingURL=index-8Htcofqc.mjs.map
