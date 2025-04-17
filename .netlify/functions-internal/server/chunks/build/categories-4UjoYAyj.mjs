import { d, l } from './index-8Htcofqc.mjs';
import { d as d$1 } from './categories-BGVwlHfX.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import 'tiny-invariant';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'dotenv';
import 'drizzle-orm/pg-core';

const c = d("app_lib_api_categories_ts--getCategories_createServerFn_handler", "/_server", (e, r) => s.__executeServer(e, r)), s = createServerFn({ method: "GET" }).handler(c, async () => await l.select().from(d$1));

export { c as getCategories_createServerFn_handler };
//# sourceMappingURL=categories-4UjoYAyj.mjs.map
