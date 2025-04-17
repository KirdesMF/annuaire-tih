import { jsx, jsxs } from 'react/jsx-runtime';
import { queryOptions, useMutation } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, HeadContent, Scripts, Link, useRouter } from '@tanstack/react-router';
import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { DropdownMenu, Avatar } from 'radix-ui';
import { useState } from 'react';
import { y, x } from './auth.server-CEln8Kin.mjs';
import { Toaster, toast } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { d as d$1 } from './index-8Htcofqc.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import { getWebRequest } from '@tanstack/start-server-core';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';
import 'drizzle-orm/pg-core';
import 'better-auth/react-start';
import 'tiny-invariant';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'dotenv';

function M(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Linkedin" }), jsx("path", { fill: "currentColor", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" })] });
}
const c = createAuthClient({ plugins: [adminClient()] });
function A(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Logout" }), jsx("path", { fill: "currentColor", d: "M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h5.903q.214 0 .357.143t.143.357t-.143.357t-.357.143H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h5.904q.214 0 .357.143t.143.357t-.143.357t-.357.143zm12.444-7.5H9.692q-.213 0-.356-.143T9.192 12t.143-.357t.357-.143h8.368l-1.971-1.971q-.141-.14-.15-.338q-.01-.199.15-.364q.159-.165.353-.168q.195-.003.36.162l2.614 2.613q.242.243.242.566t-.243.566l-2.613 2.613q-.146.146-.347.153t-.366-.159q-.16-.165-.157-.357t.162-.35z" })] });
}
function _(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Settings account" }), jsx("path", { fill: "currentColor", d: "M14.654 21.846q-.529 0-.9-.37t-.37-.899v-5.923q0-.529.37-.9t.9-.37h5.923q.529 0 .899.37t.37.9v5.923q0 .529-.37.899t-.899.37zM11 17.386V21h-.098q-.348 0-.576-.229t-.29-.571l-.263-2.092q-.479-.145-1.036-.454q-.556-.31-.947-.664l-1.915.824q-.317.14-.644.03t-.504-.415L3.648 15.57q-.177-.305-.104-.638t.348-.546l1.672-1.25q-.045-.272-.073-.559q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626l-1.672-1.25q-.275-.213-.338-.555t.113-.648l1.06-1.8q.177-.287.504-.406t.644.021l1.896.804q.448-.373.97-.673q.52-.3 1.013-.464l.283-2.092q.061-.342.318-.571T10.96 3h2.08q.349 0 .605.229q.257.229.319.571l.263 2.112q.575.202 1.016.463t.909.654l1.992-.804q.318-.14.645-.021t.503.406l1.06 1.819q.177.306.104.641q-.073.336-.348.544l-1.216.911q-.176.135-.362.133t-.346-.173t-.148-.38t.183-.347l1.225-.908l-.994-1.7l-2.552 1.07q-.454-.499-1.193-.935q-.74-.435-1.4-.577L13 4h-1.994l-.312 2.689q-.756.161-1.39.52q-.633.358-1.26.985L5.55 7.15l-.994 1.7l2.169 1.62q-.125.336-.175.73t-.05.82q0 .38.05.755t.156.73l-2.15 1.645l.994 1.7l2.475-1.05q.6.606 1.363.999t1.612.588m.973-7.887q-1.046 0-1.773.724T9.473 12q0 .467.16.89t.479.777q.16.183.366.206q.207.023.384-.136q.177-.154.181-.355t-.154-.347q-.208-.2-.312-.47T10.473 12q0-.625.438-1.063t1.062-.437q.289 0 .565.116q.276.117.476.324q.146.148.338.134q.192-.015.346-.191q.154-.177.134-.381t-.198-.364q-.311-.3-.753-.469t-.908-.169m5.643 8.962q-.625 0-1.197.191q-.571.191-1.057.56q-.287.22-.44.445t-.153.456q0 .136.106.242t.242.105h5.097q.105 0 .177-.095q.07-.097.07-.252q0-.231-.152-.456q-.153-.225-.44-.444q-.486-.37-1.057-.561t-1.196-.191m0-.846q.528 0 .899-.37q.37-.371.37-.9t-.37-.899t-.9-.37q-.528 0-.899.37q-.37.37-.37.9q0 .528.37.898t.9.37" })] });
}
function k(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Entreprise" }), jsx("path", { fill: "currentColor", d: "M4.616 20q-.691 0-1.153-.462T3 18.384V8.616q0-.691.463-1.153T4.615 7H9V5.615q0-.69.463-1.153T10.616 4h2.769q.69 0 1.153.462T15 5.615V7h4.385q.69 0 1.152.463T21 8.616v9.769q0 .69-.463 1.153T19.385 20zm0-1h14.769q.23 0 .423-.192t.192-.424V8.616q0-.231-.192-.424T19.385 8H4.615q-.23 0-.423.192T4 8.616v9.769q0 .23.192.423t.423.192M10 7h4V5.615q0-.23-.192-.423T13.385 5h-2.77q-.23 0-.423.192T10 5.615zM4 19V8z" })] });
}
function F(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Add" }), jsx("path", { fill: "currentColor", d: "M18 20v-3h-3v-2h3v-3h2v3h3v2h-3v3zM3 21q-.825 0-1.412-.587T1 19V5q0-.825.588-1.412T3 3h14q.825 0 1.413.588T19 5v5h-2V8H3v11h13v2z" })] });
}
function B(t) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...t, children: [jsx("title", { children: "Dashboard" }), jsx("path", { fill: "currentColor", d: "M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1H11.5V5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192m6.885 0h5.885q.23 0 .423-.192t.192-.424V12h-6.5zm0-8H19V5.616q0-.231-.192-.424T18.384 5H12.5z" })] });
}
function D() {
  const { data: t } = c.useSession(), s = t == null ? void 0 : t.user.role;
  return { isAdmin: x(s) && (s === "admin" || s === "superadmin") };
}
const Q = [{ label: "Qui sommes-nous ?", to: "/about" }, { label: "FAQ", to: "/faq" }, { label: "Sources", to: "/sources" }, { label: "Contact", to: "/contact" }];
function G({ session: t, queryClient: s }) {
  return jsx("header", { className: "px-16 py-1.5 border-b border-gray-200 backdrop-blur-sm", children: jsxs("nav", { className: "flex items-center justify-between", children: [jsxs("ul", { className: "flex items-center gap-4", children: [jsx("li", { children: jsx(Link, { to: "/", className: "text-sm font-light", children: "Annuaire TIH" }) }), Q.map((l) => jsx("li", { children: jsx(Link, { to: l.to, className: "text-sm font-light", activeProps: { className: "text-blue-700" }, children: l.label }) }, l.to))] }), jsxs("div", { className: "flex items-center gap-4", children: [jsx("a", { href: "https://linkedin.com/groups/13011531", target: "_blank", rel: "noopener noreferrer", className: "hover:text-blue-700 transition-colors", children: jsx(M, { className: "size-5" }) }), jsx(O, { session: t }), jsx(j, { session: t }), jsx(K, { session: t, queryClient: s })] })] }) });
}
function O({ session: t }) {
  return t ? null : jsx(Link, { to: "/signup", className: "text-xs px-2 py-1 rounded-sm border border-gray-400", children: "Se r\xE9f\xE9rencer" });
}
function j({ session: t }) {
  return t ? null : jsx(Link, { to: "/login", className: "text-xs px-2 py-1 rounded-sm border border-gray-400 cursor-pointer", children: "Login" });
}
function K({ session: t, queryClient: s }) {
  const l = useRouter(), [o, h] = useState("light"), { isAdmin: m } = D(), { mutate: u } = useMutation({ mutationFn: () => c.signOut(), onSuccess: () => {
    s.clear(), toast.success("Vous \xEAtes d\xE9connect\xE9"), l.navigate({ to: "/" });
  } });
  if (!t) return null;
  async function p() {
    u();
  }
  return jsxs(DropdownMenu.Root, { children: [jsx(DropdownMenu.Trigger, { className: "rounded-full cursor-pointer", children: jsx(P, { session: t }) }), jsx(DropdownMenu.Portal, { children: jsxs(DropdownMenu.Content, { sideOffset: 2, align: "end", className: "bg-white border rounded-sm border-gray-200 min-w-64 overflow-hidden p-1 shadow-xs", children: [jsxs("div", { className: "flex flex-col p-2", children: [jsx("span", { className: "text-sm", children: t.user.name }), jsx("span", { className: "truncate text-xs", children: t.user.email })] }), jsx(DropdownMenu.Separator, { className: "h-px bg-gray-200 my-1 -mx-1" }), jsxs(DropdownMenu.Group, { children: [jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/compte/entreprises/add", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(F, { className: "size-4" }), jsx("span", { className: "text-xs", children: "R\xE9f\xE9rencer" })] }) }), jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/compte/entreprises", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(k, { className: "size-4" }), jsx("span", { className: "text-xs", children: "Mes entreprises" })] }) }), jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/compte/preferences", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(_, { className: "size-4" }), jsx("span", { className: "text-xs", children: "Mon compte" })] }) }), m ? jsx(DropdownMenu.Item, { asChild: true, children: jsxs(Link, { to: "/admin/dashboard", className: "outline-none flex items-center gap-2 px-2 py-1.5 data-highlighted:bg-gray-100 select-none", children: [jsx(B, { className: "size-4" }), jsx("span", { className: "text-xs", children: "Admin dashboard" })] }) }) : null] }), jsx(DropdownMenu.Separator, { className: "h-px bg-gray-200 my-1 -mx-1" }), jsxs(DropdownMenu.Group, { children: [jsx(DropdownMenu.Label, { className: "text-sm font-light px-2 py-1.5", children: "Th\xE8me" }), jsxs(DropdownMenu.RadioGroup, { value: o, onValueChange: h, children: [jsxs(DropdownMenu.RadioItem, { value: "light", className: "text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center", children: [jsx(DropdownMenu.ItemIndicator, { className: "absolute start-2", children: jsx("span", { className: "size-2 rounded-full flex bg-gray-400" }) }), "Light"] }), jsxs(DropdownMenu.RadioItem, { value: "dark", className: "text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center", children: [jsx(DropdownMenu.ItemIndicator, { className: "absolute start-2", children: jsx("span", { className: "size-2 rounded-full flex bg-gray-400" }) }), "Dark"] }), jsxs(DropdownMenu.RadioItem, { value: "system", className: "text-xs py-1.5 ps-8 select-none outline-none data-highlighted:bg-gray-100 relative flex items-center", children: [jsx(DropdownMenu.ItemIndicator, { className: "absolute start-2", children: jsx("span", { className: "size-2 rounded-full flex bg-gray-400" }) }), "System"] })] })] }), jsx(DropdownMenu.Separator, { className: "h-px bg-gray-200 my-1 -mx-1" }), jsx(DropdownMenu.Group, { children: jsxs(DropdownMenu.Item, { onSelect: () => p(), className: "text-xs px-2 py-1.5 outline-none cursor-pointer flex items-center gap-2 data-highlighted:bg-gray-100", children: [jsx(A, { className: "size-4" }), jsx("span", { children: "Se d\xE9connecter" })] }) })] }) })] });
}
function P({ session: t }) {
  var _a;
  if (!t) return null;
  const s = (_a = t.user.name) == null ? void 0 : _a.split(" ").map((l) => l[0]).join("");
  return t.user.image ? jsxs(Avatar.Root, { className: "size-6 rounded-full", children: [jsx(Avatar.Image, { src: t.user.image, alt: t.user.name, className: "size-full rounded-full" }), jsx(Avatar.Fallback, { className: "size-full leading-1", children: s })] }) : jsx(Avatar.Root, { className: "size-8 rounded-full border border-gray-200 flex", children: jsx(Avatar.Fallback, { className: "size-full leading-1 text-xs grid place-items-center text-blue-500", children: s }) });
}
const E = "/_server/assets/app-BvlQHg4K.css", U = d$1("app_routes_root_tsx--getSession_createServerFn_handler", "/_server", (t, s) => d.__executeServer(t, s)), d = createServerFn({ method: "GET" }).handler(U, async () => {
  const t = getWebRequest();
  return t ? await y.api.getSession({ headers: t.headers }) : null;
}), W = queryOptions({ queryKey: ["user", "session"], queryFn: ({ signal: t }) => d({ signal: t }) });
function J() {
  return jsx(Y, { children: jsx(Outlet, {}) });
}
const X = createRootRouteWithContext()({ head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "Annuaire TIH" }], links: [{ rel: "stylesheet", href: E }] }), beforeLoad: async ({ context: t }) => ({ session: await t.queryClient.fetchQuery(W) }), notFoundComponent: () => jsx("div", { children: "Not found" }), component: J });
function Y({ children: t }) {
  const { session: s, queryClient: l } = X.useRouteContext();
  return jsxs("html", { lang: "fr", children: [jsx("head", { children: jsx(HeadContent, {}) }), jsxs("body", { className: "font-sans text-gray-700 isolate", children: [jsx(G, { session: s, queryClient: l }), t, jsx(Toaster, {}), jsx(ReactQueryDevtools, { buttonPosition: "bottom-left" }), jsx(Scripts, {})] })] });
}

export { U as getSession_createServerFn_handler };
//# sourceMappingURL=__root-314AODrE.mjs.map
