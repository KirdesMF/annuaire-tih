import { createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import * as e from 'valibot';
import { y } from './auth.server-CEln8Kin.mjs';
import { d } from './index-8Htcofqc.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';
import 'drizzle-orm/pg-core';
import 'better-auth/react-start';
import 'tiny-invariant';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'dotenv';

const a = () => import('./login-02gR8xUb.mjs'), c = e.object({ email: e.pipe(e.string(), e.email()), password: e.pipe(e.string(), e.minLength(8)) }), l = d("app_routes_auth_login_tsx--loginFn_createServerFn_handler", "/_server", (e, r) => _.__executeServer(e, r)), _ = createServerFn({ method: "POST" }).validator((e$1) => e.parse(c, e$1)).handler(l, async ({ data: e }) => {
  console.log(e), await y.api.signInEmail({ body: { email: e.email, password: e.password } });
}), g = createFileRoute("/_auth/login")({ component: lazyRouteComponent(a, "component", () => g.ssr), beforeLoad: async ({ context: e }) => {
  var _a;
  if ((_a = e.session) == null ? void 0 : _a.user) throw redirect({ to: "/compte/entreprises" });
} });

export { l as loginFn_createServerFn_handler };
//# sourceMappingURL=login-BhSqD-hQ.mjs.map
