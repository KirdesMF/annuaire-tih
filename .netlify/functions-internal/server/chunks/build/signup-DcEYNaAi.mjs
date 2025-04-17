import { jsxs, jsx } from 'react/jsx-runtime';
import { redirect, createFileRoute, lazyRouteComponent } from '@tanstack/react-router';
import { APIError } from 'better-auth/api';
import * as e from 'valibot';
import { Resend } from 'resend';
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

const h = () => import('./signup-C_1YHVpu.mjs'), f = e.object({ email: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre email"), e.email("Veuillez entrer un email valide")), password: e.pipe(e.string(), e.minLength(8, "Le mot de passe doit contenir au moins 8 caract\xE8res"), e.maxLength(100, "Le mot de passe doit contenir au plus 100 caract\xE8res")), firstName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre pr\xE9nom"), e.maxLength(100, "Le pr\xE9nom doit contenir au plus 100 caract\xE8res")), lastName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre nom"), e.maxLength(100, "Le nom doit contenir au plus 100 caract\xE8res")) }), _ = d("app_routes_auth_signup_tsx--signupFn_createServerFn_handler", "/_server", (r, t) => L.__executeServer(r, t)), L = createServerFn().validator((r) => e.parse(f, r)).handler(_, async ({ data: r }) => {
  try {
    await y.api.signUpEmail({ body: { email: r.email, password: r.password, name: `${r.firstName} ${r.lastName}` } });
  } catch (n) {
    if (n instanceof APIError) return { status: "error", message: n.message };
  }
  const t = new Resend(process.env.RESEND_API_KEY), { data: a, error: o } = await t.emails.send({ from: "Acme <onboarding@resend.dev>", to: "cedgourville@gmail.com", subject: "Bienvenue sur l'application de gestion de projet", react: jsxs("div", { children: [jsx("h1", { children: "Bienvenue sur l'application de gestion de projet" }), jsx("p", { children: "Votre compte a \xE9t\xE9 cr\xE9\xE9 avec succ\xE8s" })] }) });
  throw o && console.error(o), console.log(a), redirect({ to: "/compte/entreprises" });
}), w = createFileRoute("/_auth/signup")({ component: lazyRouteComponent(h, "component", () => w.ssr), beforeLoad: async ({ context: r }) => {
  var _a;
  if ((_a = r.session) == null ? void 0 : _a.user) throw redirect({ to: "/compte/entreprises" });
} });

export { _ as signupFn_createServerFn_handler };
//# sourceMappingURL=signup-DcEYNaAi.mjs.map
