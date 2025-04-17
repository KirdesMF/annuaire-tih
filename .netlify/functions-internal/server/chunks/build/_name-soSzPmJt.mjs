import { jsx, jsxs } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { i as ie, Z as Zt, r as rt } from '../nitro/nitro.mjs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { n } from './company-logo-DcDO8tdb.mjs';
import { i, r, o, n as n$1, h, e } from './globe-BUymkEPS.mjs';
import { Separator } from 'radix-ui';
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
import 'react';
import 'drizzle-orm/pg-core';
import '@tanstack/react-query-devtools';
import 'valibot';
import 'drizzle-orm';
import 'decode-formdata';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import './cn-bhneXptQ.mjs';
import 'clsx';
import 'tailwind-merge';

function C(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Copy" }), jsx("path", { fill: "currentColor", d: "M9.116 17q-.691 0-1.153-.462T7.5 15.385V4.615q0-.69.463-1.153T9.116 3h7.769q.69 0 1.153.462t.462 1.153v10.77q0 .69-.462 1.152T16.884 17zm0-1h7.769q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T16.884 4H9.116q-.231 0-.424.192t-.192.423v10.77q0 .23.192.423t.423.192m-3 4q-.69 0-1.153-.462T4.5 18.385V7.115q0-.213.143-.356T5 6.616t.357.143t.143.357v11.269q0 .23.192.423t.423.192h8.27q.213 0 .356.143t.143.357t-.143.357t-.357.143zM8.5 16V4z" })] });
}
function q({ children: t, ...i }) {
  function r() {
    typeof t == "string" && navigator.clipboard.writeText(t), toast.success("Copi\xE9 dans le presse-papiers");
  }
  return jsxs("button", { type: "button", className: "text-xs px-2 py-1 rounded-sm border border-gray-300 text-gray-500 flex items-center gap-1.5 cursor-pointer", onClick: r, ...i, children: [t, jsx(C, { className: "size-4" })] });
}
function I(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Link chain" }), jsxs("g", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", children: [jsx("path", { d: "M13.544 10.456a4.37 4.37 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177" }), jsx("path", { d: "M10.456 13.544a4.37 4.37 0 0 0 6.176 0l3.089-3.088a4.367 4.367 0 1 0-6.177-6.177L12 5.823" })] })] });
}
const k = { remote: "\xC0 distance", hybrid: "Hybride", onsite: "Sur site", not_specified: "Non sp\xE9cifi\xE9" }, z = { facebook: jsx(e, { className: "size-5" }), instagram: jsx(h, { className: "size-5" }), linkedin: jsx(rt, { className: "size-5" }), calendly: jsx(n$1, { className: "size-5" }) }, re = function() {
  var _a, _b, _c, _d;
  const i$1 = ie.useSearch(), { data: r$1 } = useSuspenseQuery(Zt(i$1.id)), { session: o$1 } = ie.useLoaderData();
  if (!r$1) return jsx("div", { children: "Company not found" });
  const l = Object.values(r$1.social_media).every((a) => a === "");
  return jsxs("main", { className: "px-4 py-8 grid gap-4", children: [jsxs("div", { className: "container flex justify-between gap-4 border border-gray-300 p-6 rounded-sm", children: [jsxs("div", { className: "flex flex-col gap-2", children: [jsx(n, { company: r$1, size: "lg" }), jsxs("div", { className: "flex items-center gap-2", children: [jsx("h1", { className: "text-2xl font-bold", children: r$1.name }), jsx(q, { children: r$1.siret }), ((_a = o$1 == null ? void 0 : o$1.user) == null ? void 0 : _a.id) === r$1.user_id && jsx(Link, { to: "/compte/entreprises/$id/edit", params: { id: r$1.id }, className: "border border-gray-300 px-2 py-1 rounded-sm text-xs h-min", children: "Edit" })] }), jsx("ul", { className: "flex flex-wrap gap-2", children: (_b = r$1.categories) == null ? void 0 : _b.map((a) => jsx("li", { className: "bg-gray-100 px-2 py-1 rounded-sm text-xs", children: a }, a)) })] }), jsx("div", { className: "flex gap-2", children: jsx("button", { type: "button", className: "bg-gray-100 p-2 rounded-sm cursor-pointer h-min", children: jsx(I, { className: "size-5" }) }) })] }), jsxs("div", { className: "container flex gap-2", children: [jsxs("div", { className: "flex-1 flex flex-col justify-center gap-4 border border-gray-300 p-6 rounded-sm", children: [jsxs("div", { className: "flex flex-col gap-2", children: [r$1.email ? jsxs("div", { className: "flex items-center gap-2", children: [jsx(i, { className: "size-5" }), jsx("p", { className: "text-xs text-gray-500", children: r$1.email })] }) : null, r$1.phone ? jsxs("div", { className: "flex items-center gap-2", children: [jsx(r, { className: "size-5" }), jsx("p", { className: "text-xs text-gray-500", children: r$1.phone })] }) : null, r$1.website ? jsxs("div", { className: "flex items-center gap-2", children: [jsx(o, { className: "size-5" }), jsx("a", { href: r$1.website, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-gray-500", children: r$1.website })] }) : null] }), l ? null : jsx("ul", { className: "flex gap-2", children: Object.entries(r$1.social_media || {}).map(([a, c]) => jsx("li", { children: jsx("a", { href: c, target: "_blank", rel: "noopener noreferrer", children: z[a] }) }, a)) })] }), jsxs("div", { className: "flex-1 border border-gray-300 p-6 rounded-sm flex flex-col gap-2", children: [jsxs("p", { className: "text-sm text-gray-500", children: [jsx("span", { className: "font-bold", children: "Entrepreneur:" }), " ", r$1.business_owner] }), jsxs("p", { className: "text-sm text-gray-500", children: [jsx("span", { className: "font-bold", children: "Zone g\xE9ographique:" }), " ", r$1.service_area] }), jsxs("p", { className: "text-sm text-gray-500", children: [jsx("span", { className: "font-bold", children: "Mode de travail:" }), " ", k[(_c = r$1.work_mode) != null ? _c : "not_specified"]] }), jsxs("p", { className: "text-sm text-gray-500", children: [jsx("span", { className: "font-bold", children: "RQTH:" }), " ", r$1.rqth ? "Oui" : "Non"] }), jsxs("p", { className: "text-sm text-gray-500", children: [jsx("span", { className: "font-bold", children: "Sous domaine:" }), " ", r$1.subdomain] })] })] }), jsxs("div", { className: "container border border-gray-300 p-6 rounded-sm grid gap-4", children: [jsxs("div", { className: "flex flex-col gap-2", children: [jsx("h2", { className: "text-lg font-bold", children: "Description" }), jsx("p", { className: "text-sm text-gray-500 text-pretty", children: r$1.description })] }), jsx(Separator.Root, { className: "h-px bg-gray-300 my-4" }), jsx("ul", { className: "flex flex-wrap gap-2", children: (_d = r$1.gallery) == null ? void 0 : _d.map((a) => jsx("li", { children: jsx("img", { src: a.secureUrl, alt: r$1.name, className: "size-16 aspect-square rounded-sm" }) }, a.publicId)) })] })] });
};

export { re as component };
//# sourceMappingURL=_name-soSzPmJt.mjs.map
