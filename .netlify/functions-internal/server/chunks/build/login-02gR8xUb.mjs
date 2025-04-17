import { jsxs, jsx } from 'react/jsx-runtime';
import { useMutation } from '@tanstack/react-query';
import { useRouter, createFileRoute, lazyRouteComponent, redirect } from '@tanstack/react-router';
import { h, x, w } from './label-BcVNeqdH.mjs';
import * as e from 'valibot';
import { y as y$1 } from './auth.server-CEln8Kin.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import { d } from './index-8Htcofqc.mjs';
import '@tanstack/router-core';
import 'clsx';
import 'tailwind-merge';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';
import 'drizzle-orm/pg-core';
import 'better-auth/react-start';
import 'tiny-invariant';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'dotenv';

const y = () => Promise.resolve().then(() => L), S = e.object({ email: e.pipe(e.string(), e.email()), password: e.pipe(e.string(), e.minLength(8)) }), F = d("app_routes_auth_login_tsx--loginFn_createServerFn_handler", "/_server", (o, n) => l.__executeServer(o, n)), l = createServerFn({ method: "POST" }).validator((o) => e.parse(S, o)).handler(F, async ({ data: o }) => {
  console.log(o), await y$1.api.signInEmail({ body: { email: o.email, password: o.password } });
}), C = createFileRoute("/_auth/login")({ component: lazyRouteComponent(y, "component", () => C.ssr), beforeLoad: async ({ context: o }) => {
  var _a;
  if ((_a = o.session) == null ? void 0 : _a.user) throw redirect({ to: "/compte/entreprises" });
} });
e.object({ email: e.pipe(e.string(), e.email()), password: e.pipe(e.string(), e.minLength(8)) });
const j = function() {
  const n = useRouter(), { mutate: c, isPending: s } = useMutation({ mutationFn: h(l) });
  async function d(i) {
    i.preventDefault();
    const a = new FormData(i.target);
    c({ data: { email: a.get("email"), password: a.get("password") } }, { onSuccess: async () => {
      n.navigate({ to: "/compte/entreprises" });
    } });
  }
  return jsxs("main", { className: "py-12", children: [jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Connexion" }), jsx("div", { className: "max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm", children: jsxs("form", { className: "flex flex-col gap-6", onSubmit: d, children: [jsxs(x, { children: ["Email *", jsx(w, { type: "email", name: "email", placeholder: "Email" })] }), jsxs(x, { children: ["Password *", jsx(w, { type: "password", name: "password", placeholder: "Password" })] }), jsx("button", { type: "submit", className: "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm", disabled: s, children: s ? "Connexion en cours..." : "Connexion" })] }) })] });
}, L = Object.freeze(Object.defineProperty({ __proto__: null, component: j }, Symbol.toStringTag, { value: "Module" }));

export { j as component };
//# sourceMappingURL=login-02gR8xUb.mjs.map
