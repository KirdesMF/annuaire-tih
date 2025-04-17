import { jsxs, jsx } from 'react/jsx-runtime';
import { useMutation } from '@tanstack/react-query';
import { h, x, w as w$1 } from './label-BcVNeqdH.mjs';
import * as e from 'valibot';
import { redirect, createFileRoute, lazyRouteComponent } from '@tanstack/react-router';
import { APIError } from 'better-auth/api';
import { Resend } from 'resend';
import { y } from './auth.server-CEln8Kin.mjs';
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

const w = () => Promise.resolve().then(() => z), L = e.object({ email: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre email"), e.email("Veuillez entrer un email valide")), password: e.pipe(e.string(), e.minLength(8, "Le mot de passe doit contenir au moins 8 caract\xE8res"), e.maxLength(100, "Le mot de passe doit contenir au plus 100 caract\xE8res")), firstName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre pr\xE9nom"), e.maxLength(100, "Le pr\xE9nom doit contenir au plus 100 caract\xE8res")), lastName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre nom"), e.maxLength(100, "Le nom doit contenir au plus 100 caract\xE8res")) }), _ = d("app_routes_auth_signup_tsx--signupFn_createServerFn_handler", "/_server", (t, n) => u.__executeServer(t, n)), u = createServerFn().validator((t) => e.parse(L, t)).handler(_, async ({ data: t }) => {
  try {
    await y.api.signUpEmail({ body: { email: t.email, password: t.password, name: `${t.firstName} ${t.lastName}` } });
  } catch (a) {
    if (a instanceof APIError) return { status: "error", message: a.message };
  }
  const n = new Resend(process.env.RESEND_API_KEY), { data: m, error: p } = await n.emails.send({ from: "Acme <onboarding@resend.dev>", to: "cedgourville@gmail.com", subject: "Bienvenue sur l'application de gestion de projet", react: jsxs("div", { children: [jsx("h1", { children: "Bienvenue sur l'application de gestion de projet" }), jsx("p", { children: "Votre compte a \xE9t\xE9 cr\xE9\xE9 avec succ\xE8s" })] }) });
  throw p && console.error(p), console.log(m), redirect({ to: "/compte/entreprises" });
}), S = createFileRoute("/_auth/signup")({ component: lazyRouteComponent(w, "component", () => S.ssr), beforeLoad: async ({ context: t }) => {
  var _a;
  if ((_a = t.session) == null ? void 0 : _a.user) throw redirect({ to: "/compte/entreprises" });
} });
e.object({ email: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre email"), e.email("Veuillez entrer un email valide")), password: e.pipe(e.string(), e.minLength(8, "Le mot de passe doit contenir au moins 8 caract\xE8res"), e.maxLength(100, "Le mot de passe doit contenir au plus 100 caract\xE8res")), firstName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre pr\xE9nom"), e.maxLength(100, "Le pr\xE9nom doit contenir au plus 100 caract\xE8res")), lastName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre nom"), e.maxLength(100, "Le nom doit contenir au plus 100 caract\xE8res")) });
const E = function() {
  const { mutate: n, isPending: m } = useMutation({ mutationFn: h(u) });
  function p(a) {
    a.preventDefault();
    const l = new FormData(a.target);
    n({ data: { email: l.get("email"), password: l.get("password"), firstName: l.get("firstName"), lastName: l.get("lastName") } });
  }
  return jsxs("main", { className: "py-12", children: [jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Cr\xE9er un compte" }), jsx("div", { className: "max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm", children: jsxs("form", { className: "flex flex-col gap-6", onSubmit: p, children: [jsxs("div", { className: "grid gap-4", children: [jsxs(x, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Nom*" }), jsx(w$1, { name: "lastName", type: "text", required: true })] }), jsxs(x, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Pr\xE9nom*" }), jsx(w$1, { name: "firstName", type: "text", required: true })] }), jsxs(x, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Email*" }), jsx(w$1, { name: "email", type: "email", required: true })] }), jsxs(x, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Mot de passe*" }), jsx(w$1, { name: "password", type: "password", required: true })] }), jsxs(x, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Confirmation du mot de passe*" }), jsx(w$1, { name: "confirmPassword", type: "password", required: true })] })] }), jsx("button", { type: "submit", className: "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm", disabled: m, children: m ? "Cr\xE9ation en cours..." : "S'inscrire" })] }) })] });
}, z = Object.freeze(Object.defineProperty({ __proto__: null, component: E }, Symbol.toStringTag, { value: "Module" }));

export { E as component };
//# sourceMappingURL=signup-C_1YHVpu.mjs.map
