import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Dialog, Separator } from 'radix-ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { n } from './company-logo-DcDO8tdb.mjs';
import { l } from './plus-BVAK8_Jr.mjs';
import { e } from './close--xrcrNXd.mjs';
import { d as de, A, b as dn } from '../nitro/nitro.mjs';
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
import 'drizzle-orm/pg-core';
import '@tanstack/react-query-devtools';
import 'valibot';
import 'drizzle-orm';
import 'decode-formdata';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';

function T({ children: l, className: n, ...i }) {
  return jsxs(Dialog.Portal, { children: [jsx(Dialog.Overlay, { className: "fixed inset-0 bg-black/40" }), jsxs(Dialog.Content, { className: `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-sm p-4 w-[min(90vw,400px)] ${n}`, ...i, children: [l, jsx(Dialog.Close, { "aria-label": "Fermer", className: "absolute top-3 end-3 ", children: jsx(e, { className: "size-5" }) })] })] });
}
const R = Dialog.Root, O = Dialog.Trigger, Q = Dialog.Title, q = Dialog.Description, z = Dialog.Close, E = { pending: "En attente de validation", active: "Approuv\xE9e", rejected: "Rejet\xE9e" };
function F() {
  return jsx("article", { className: "border border-gray-300 p-5 rounded-sm", children: jsxs(Link, { to: "/compte/entreprises/add", className: "text-sm border px-2 py-1 rounded-sm flex items-center gap-1.5 max-w-fit", children: [jsx(l, { className: "size-4" }), "Cr\xE9er une entreprise"] }) });
}
const ce = function() {
  var _a, _b;
  const n$1 = de.useRouteContext(), i = useSuspenseQuery(A), { mutate: u, isPending: x } = useMutation({ mutationFn: dn }), [h, d] = useState(false), [c, g] = useState(null);
  function f(t) {
    t.preventDefault();
    const o = new FormData(t.target);
    u({ data: o.get("companyId") }, { onSuccess: () => {
      n$1.queryClient.invalidateQueries({ queryKey: ["user", "companies"] }), n$1.queryClient.invalidateQueries({ queryKey: ["company", c] }), d(false), toast.success("Entreprise supprim\xE9e avec succ\xE8s");
    }, onError: () => {
      toast.error("Une erreur est survenue lors de la suppression de l'entreprise");
    } });
  }
  return ((_a = i.data) == null ? void 0 : _a.length) ? jsxs("div", { className: "container px-4 py-6", children: [jsxs("header", { className: "mb-6", children: [jsx("h1", { className: "text-2xl font-bold", children: "Mes entreprises" }), jsx("p", { children: "G\xE9rez vos entreprises et leurs informations." })] }), jsx("ul", { className: "flex flex-col gap-2 ", children: (_b = i.data) == null ? void 0 : _b.map((t) => jsx("li", { children: jsxs("article", { className: "border border-gray-300 p-5 rounded-sm grid gap-4 shadow-2xs", children: [jsxs("header", { className: "flex items-baseline gap-2 justify-between", children: [jsxs("div", { className: "flex items-center gap-2", children: [jsx(n, { company: t }), jsx("h2", { className: "text-lg font-bold leading-1", children: t.name }), jsx("p", { className: "text-xs text-orange-300", children: E[t.status] })] }), jsx("p", { className: "text-xs text-gray-500 border px-2 py-1 rounded-sm inline-flex gap-2 items-center hover:cursor-pointer ", children: t.siret })] }), jsxs("footer", { className: "flex items-center gap-2 justify-between", children: [jsx("ul", { className: "flex flex-wrap gap-2", children: t.categories.map((o) => jsx("li", { className: "bg-gray-100 px-2 py-1 rounded-sm text-xs flex items-center gap-2", children: o.category_name }, o.category_id)) }), jsxs("div", { className: "flex gap-2", children: [jsx(Link, { to: "/entreprises/$name", params: { name: t.name.toLowerCase().replace(/ /g, "-") }, search: { id: t.id }, className: "text-xs px-2 py-1 rounded-sm border border-blue-400 text-blue-400", children: "Consulter" }), jsx(Link, { to: "/compte/entreprises/$id/edit", params: { id: t.id }, className: "text-xs px-2 py-1 rounded-sm border border-blue-400 text-blue-400", children: "Modifier" }), jsxs(R, { open: h && c === t.id, onOpenChange: d, children: [jsx(O, { asChild: true, children: jsx("button", { type: "button", className: "text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors", onClick: () => g(t.id), children: "Supprimer" }) }), jsxs(T, { className: "grid gap-4", children: [jsx(Q, { className: "text-lg font-bold", children: "Supprimer une entreprise" }), jsxs("div", { className: "space-y-2", children: [jsxs(q, { className: "text-sm text-gray-500", children: ["Valider la suppression de l'entreprise ", jsx("strong", { children: t.name }), " ?"] }), jsx("p", { className: "text-sm text-gray-500", children: "Cette action est irr\xE9versible. Toutes les donn\xE9es li\xE9es \xE0 cette entreprise seront perdues." })] }), jsxs("div", { className: "grid grid-flow-col gap-2 place-content-end", children: [jsx(z, { asChild: true, children: jsx("button", { type: "button", className: "text-xs px-2 py-1 rounded-sm border border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white transition-colors", children: "Annuler" }) }), jsxs("form", { onSubmit: f, children: [jsx("input", { type: "hidden", name: "companyId", value: t.id }), jsx("button", { type: "submit", className: "text-xs px-2 py-1 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-colors", children: x ? "..." : "Valider" })] })] })] })] })] })] })] }) }, t.id)) }), i.data.length < 3 && jsxs(Fragment, { children: [jsx(Separator.Root, { className: "my-6 h-px bg-gray-300" }), jsx(F, {})] })] }) : jsx("div", { className: "container px-4 py-6", children: jsxs("div", { className: "flex flex-col items-center justify-center gap-4", children: [jsx("h1", { className: "text-2xl font-bold", children: "Vous n'avez encore d'entreprise r\xE9f\xE9renc\xE9e" }), jsx(Link, { to: "/compte/entreprises/add", className: "text-sm border px-2 py-1 rounded-sm", children: "Cr\xE9er une entreprise" })] }) });
};

export { ce as component };
//# sourceMappingURL=index-Bra5vMkb.mjs.map
