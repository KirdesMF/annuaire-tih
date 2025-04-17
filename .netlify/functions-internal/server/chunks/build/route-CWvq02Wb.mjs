import { jsxs, jsx } from 'react/jsx-runtime';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet } from '@tanstack/react-router';
import { Separator } from 'radix-ui';
import { l } from './plus-BVAK8_Jr.mjs';
import { A } from '../nitro/nitro.mjs';
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
import 'sonner';
import '@tanstack/react-query-devtools';
import 'valibot';
import 'drizzle-orm';
import 'decode-formdata';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';

const L = function() {
  const o = useSuspenseQuery(A);
  return jsxs("div", { className: "flex min-h-[calc(100svh-45px)]", children: [jsx("aside", { className: "sticky inset-y-0 border-e border-gray-200 px-1 py-2", children: jsx("nav", { children: jsxs("ul", { className: "flex flex-col gap-2", children: [jsxs("li", { className: "flex flex-col gap-1", children: [jsx(Link, { to: "/compte/entreprises", className: "text-sm font-light flex ps-4 pe-8 py-1.5 select-none text-gray-500 hover:text-gray-900 transition-colors", children: "Mes entreprises" }), jsx("ul", { className: "ms-4", children: jsx("li", { children: jsxs(Link, { to: "/compte/entreprises/add", className: "text-xs font-light flex items-center gap-1 px-4 py-1.5 text-gray-500 hover:text-gray-900 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed", disabled: o.data && o.data.length >= 3, children: [jsx(l, { className: "size-3" }), "R\xE9f\xE9rencer"] }) }) })] }), jsx(Separator.Root, { orientation: "horizontal", decorative: true, className: "h-px bg-gray-200 -mx-1" }), jsx("li", { children: jsx(Link, { to: "/compte/preferences", className: "text-sm font-light flex ps-4 pe-8 py-1.5 select-none text-gray-500 hover:text-gray-900", children: "Pref\xE9rences" }) }), jsx(Separator.Root, { orientation: "horizontal", decorative: true, className: "h-px bg-gray-200 -mx-1" })] }) }) }), jsx("main", { className: "flex-1", children: jsx(Outlet, {}) })] });
};

export { L as component };
//# sourceMappingURL=route-CWvq02Wb.mjs.map
