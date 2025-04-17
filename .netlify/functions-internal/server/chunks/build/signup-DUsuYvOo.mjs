import { jsxs, jsx } from 'react/jsx-runtime';
import { useMutation } from '@tanstack/react-query';
import { m, l } from './label-B1qOmGit.mjs';
import * as e from 'valibot';
import { c as cn } from '../nitro/nitro.mjs';
import { u } from './useServerFn-DtzmTnlI.mjs';
import './cn-bhneXptQ.mjs';
import 'clsx';
import 'tailwind-merge';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import '@tanstack/router-core';
import 'tiny-invariant';
import '@tanstack/start-server-core';
import '@tanstack/start-client-core';
import '@tanstack/react-router';
import 'better-auth/react';
import 'better-auth/client/plugins';
import 'radix-ui';
import 'react';
import 'drizzle-orm/pg-core';
import 'sonner';
import '@tanstack/react-query-devtools';
import 'drizzle-orm';
import 'decode-formdata';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';

e.object({ email: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre email"), e.email("Veuillez entrer un email valide")), password: e.pipe(e.string(), e.minLength(8, "Le mot de passe doit contenir au moins 8 caract\xE8res"), e.maxLength(100, "Le mot de passe doit contenir au plus 100 caract\xE8res")), firstName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre pr\xE9nom"), e.maxLength(100, "Le pr\xE9nom doit contenir au plus 100 caract\xE8res")), lastName: e.pipe(e.string(), e.nonEmpty("Veuillez entrer votre nom"), e.maxLength(100, "Le nom doit contenir au plus 100 caract\xE8res")) });
const G = function() {
  const { mutate: s, isPending: m$1 } = useMutation({ mutationFn: u(cn) });
  function p(n) {
    n.preventDefault();
    const i = new FormData(n.target);
    s({ data: { email: i.get("email"), password: i.get("password"), firstName: i.get("firstName"), lastName: i.get("lastName") } });
  }
  return jsxs("main", { className: "py-12", children: [jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Cr\xE9er un compte" }), jsx("div", { className: "max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm", children: jsxs("form", { className: "flex flex-col gap-6", onSubmit: p, children: [jsxs("div", { className: "grid gap-4", children: [jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Nom*" }), jsx(l, { name: "lastName", type: "text", required: true })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Pr\xE9nom*" }), jsx(l, { name: "firstName", type: "text", required: true })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Email*" }), jsx(l, { name: "email", type: "email", required: true })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Mot de passe*" }), jsx(l, { name: "password", type: "password", required: true })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { children: "Confirmation du mot de passe*" }), jsx(l, { name: "confirmPassword", type: "password", required: true })] })] }), jsx("button", { type: "submit", className: "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm", disabled: m$1, children: m$1 ? "Cr\xE9ation en cours..." : "S'inscrire" })] }) })] });
};

export { G as component };
//# sourceMappingURL=signup-DUsuYvOo.mjs.map
