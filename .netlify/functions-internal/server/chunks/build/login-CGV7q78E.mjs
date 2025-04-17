import { jsxs, jsx } from 'react/jsx-runtime';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { m, l } from './label-B1qOmGit.mjs';
import * as e from 'valibot';
import { l as ln } from '../nitro/nitro.mjs';
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

e.object({ email: e.pipe(e.string(), e.email()), password: e.pipe(e.string(), e.minLength(8)) });
const K = function() {
  const s = useRouter(), { mutate: p, isPending: r } = useMutation({ mutationFn: u(ln) });
  async function l$1(m) {
    m.preventDefault();
    const i = new FormData(m.target);
    p({ data: { email: i.get("email"), password: i.get("password") } }, { onSuccess: async () => {
      s.navigate({ to: "/compte/entreprises" });
    } });
  }
  return jsxs("main", { className: "py-12", children: [jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "Connexion" }), jsx("div", { className: "max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm", children: jsxs("form", { className: "flex flex-col gap-6", onSubmit: l$1, children: [jsxs(m, { children: ["Email *", jsx(l, { type: "email", name: "email", placeholder: "Email" })] }), jsxs(m, { children: ["Password *", jsx(l, { type: "password", name: "password", placeholder: "Password" })] }), jsx("button", { type: "submit", className: "border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm", disabled: r, children: r ? "Connexion en cours..." : "Connexion" })] }) })] });
};

export { K as component };
//# sourceMappingURL=login-CGV7q78E.mjs.map
