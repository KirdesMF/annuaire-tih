import { jsxs, jsx } from 'react/jsx-runtime';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { W } from '../nitro/nitro.mjs';
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
import 'valibot';
import 'drizzle-orm';
import 'decode-formdata';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';

const l = "/_build/assets/banner-Evc62HPL.png";
function c(i) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...i, children: [jsx("title", { children: "Rechercher" }), jsx("path", { fill: "currentColor", d: "M9.539 15.23q-2.398 0-4.065-1.666Q3.808 11.899 3.808 9.5t1.666-4.065T9.539 3.77t4.064 1.666T15.269 9.5q0 1.042-.369 2.017t-.97 1.668l5.909 5.907q.14.14.15.345q.009.203-.15.363q-.16.16-.354.16t-.354-.16l-5.908-5.908q-.75.639-1.725.989t-1.96.35m0-1q1.99 0 3.361-1.37q1.37-1.37 1.37-3.361T12.9 6.14T9.54 4.77q-1.991 0-3.361 1.37T4.808 9.5t1.37 3.36t3.36 1.37" })] });
}
function m() {
  return jsxs("div", { className: "flex items-center gap-2 border border-gray-400 rounded-md shadow-sm bg-white w-[min(100%,500px)] h-12 focus-within:outline focus-within:outline-blue-500", children: [jsx("input", { type: "text", placeholder: "Rechercher un nom ou une activit\xE9...", className: "w-full h-full placeholder:text-gray-400 placeholder:text-sm placeholder:font-light px-3 py-1 outline-none" }), jsx("button", { type: "button", className: "px-3 py-2 h-full grid place-items-center rounded-e-sm bg-gray-800 text-white", children: jsx(c, { className: "w-7 h-7" }) })] });
}
const D = function() {
  const o = useSuspenseQuery(W);
  return jsxs("main", { className: "px-4 py-6 max-w-4xl mx-auto", children: [jsxs("div", { className: "mt-12 grid place-items-center relative h-60 border border-gray-400 rounded-md ", children: [jsx("div", { className: "absolute inset-0 bg-diagonal-lines" }), jsx("img", { "aria-hidden": true, src: l, alt: "banner", className: "w-full h-full object-contain absolute inset-0" })] }), jsx("div", { className: "mt-12 flex justify-center", children: jsx(m, {}) }), jsx("div", { role: "separator", tabIndex: -1, className: "h-px w-1/3 bg-gray-400 my-12 mx-auto" }), jsx("ul", { className: "flex flex-wrap justify-center gap-2 mt-12 max-w-3xl mx-auto", children: o.data.map((r) => jsx("li", { children: jsx(Link, { to: "/categories/$id", params: { id: r.id.toString() }, className: "text-sm px-4 py-2 border border-gray-400 rounded-md flex", children: r.name }) }, r.id)) }), jsxs("div", { className: "flex flex-col gap-4 mt-12 max-w-3xl mx-auto", children: [jsxs("article", { className: "p-4 flex flex-col gap-3", children: [jsx("h2", { children: "D'entreprise \xE0 TIH, de gagnant \xE0 gagnant !" }), jsx("p", { className: "text-sm font-light", children: "\xC9largissez votre vivier de talents en d\xE9couvrant des profils d'entrepreneurs\xB7ses expert\xB7e\xB7s dans leur domaine et dot\xE9\xB7e\xB7s d'une grande force d'adaptation. Renforcez votre politique inclusive et b\xE9n\xE9ficiez de r\xE9ductions sur votre contribution OETH en sous-traitant avec des TIH !" })] }), jsxs("article", { className: "p-4 flex flex-col gap-3", children: [jsx("h2", { children: "De nombreux services propos\xE9s aux particuliers !" }), jsx("p", { className: "text-sm font-light", children: "Faites appel \xE0 un\xB7e professionnel\xB7le pour vous accompagner ou r\xE9aliser vos t\xE2ches, de fa\xE7on ponctuelle ou pour des missions plus longues. Profitez de services sur mesure et d\xE9couvrez les nombreux domaines couverts par les TIH." })] })] })] });
};

export { D as component };
//# sourceMappingURL=index-BEVw6ugx.mjs.map
