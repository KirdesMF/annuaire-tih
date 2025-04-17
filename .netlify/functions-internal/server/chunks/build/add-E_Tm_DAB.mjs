import { jsx, jsxs } from 'react/jsx-runtime';
import { useMutation } from '@tanstack/react-query';
import { useRouter, Link } from '@tanstack/react-router';
import { m, l } from './label-B1qOmGit.mjs';
import { Command } from 'cmdk';
import { useState, useRef } from 'react';
import { e as e$1 } from './close--xrcrNXd.mjs';
import { m as me, p as pn, r as rt, G as Gt } from '../nitro/nitro.mjs';
import { toast } from 'sonner';
import { Popover, Separator } from 'radix-ui';
import * as e from 'valibot';
import { decode } from 'decode-formdata';
import { i, r, o, e as e$2, h, n } from './globe-BUymkEPS.mjs';
import { l as l$1 } from './plus-BVAK8_Jr.mjs';
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
import 'drizzle-orm/pg-core';
import '@tanstack/react-query-devtools';
import 'drizzle-orm';
import '@tanstack/react-router-with-query';
import 'node:stream';
import 'isbot';
import 'react-dom/server';

function ae(b) {
  return jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", ...b, children: [jsx("title", { children: "Chevron down" }), jsx("path", { fill: "currentColor", d: "M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" })] });
}
const De = function() {
  const L = me.useRouteContext(), w = me.useLoaderData(), D = useRouter(), { mutate: j, isPending: v } = useMutation({ mutationFn: u(pn) }), [p, C] = useState(/* @__PURE__ */ new Set()), [i$1, z] = useState({ gallery: [] }), [F, M] = useState(0), I = useRef(null);
  function _(r) {
    C((t) => t.size >= 3 ? (toast.error("Vous ne pouvez pas s\xE9lectionner plus de 3 cat\xE9gories"), t) : new Set(t).add(r));
  }
  function q(r) {
    C((t) => {
      const l = new Set(t);
      return l.delete(r), l;
    });
  }
  function A(r) {
    M(r.target.value.length);
  }
  function u$1(r, t, l) {
    var _a;
    const o = (_a = r.target.files) == null ? void 0 : _a[0];
    if (!o) return;
    const c = new FileReader();
    c.onload = () => {
      const x = c.result;
      t === "logo" && z((g) => ({ ...g, logo: x })), t === "gallery" && l && z((g) => {
        const E = [...g.gallery];
        return E[l] = x, { ...g, gallery: E };
      });
    }, c.readAsDataURL(o);
  }
  function B() {
    const r = new FormData(I.current);
    for (const o of p) r.append("categories", o);
    const t = decode(r, { files: ["logo", "gallery"], arrays: ["categories", "gallery"], booleans: ["rqth"] }), l = e.safeParse(Gt, t, { abortPipeEarly: true });
    console.log(l);
  }
  function G(r) {
    r.preventDefault();
    const t = new FormData(r.target);
    for (const c of p) t.append("categories", c);
    const l = decode(t, { files: ["logo", "gallery"], arrays: ["categories", "gallery"], booleans: ["rqth"] }), o = e.safeParse(Gt, l, { abortPipeEarly: true });
    if (!o.success) {
      toast.error(jsx("div", { children: o.issues.map((c, x) => jsx("p", { children: c.message }, x)) }));
      return;
    }
    j({ data: t }, { onSuccess: () => {
      L.queryClient.invalidateQueries({ queryKey: ["user", "companies"] }), toast.success("Entreprise cr\xE9\xE9e avec succ\xE8s"), D.navigate({ to: "/compte/entreprises" });
    } });
  }
  return jsx("div", { className: "container px-4 py-6", children: jsxs("div", { className: "max-w-xl mx-auto", children: [jsx("h1", { className: "text-2xl font-bold mb-4", children: "R\xE9f\xE9rencez votre entreprise" }), jsxs("form", { className: "flex flex-col gap-3", ref: I, onSubmit: G, children: [jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Nom de l'entreprise *" }), jsx(l, { type: "text", name: "name", placeholder: "Ex: mon entreprise", className: "placeholder:text-xs" })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Siret *" }), jsx(l, { type: "text", name: "siret", placeholder: "Ex: 12345678901234", className: "placeholder:text-xs" })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Cat\xE9gories * (max. 3)" }), jsxs(Popover.Root, { children: [jsxs(Popover.Trigger, { className: "h-9 cursor-pointer border rounded-sm border-gray-300 px-2 py-1 text-xs flex items-center justify-between gap-2", children: [jsx("span", { className: "rounded-sm text-xs flex items-center gap-2 text-gray-400", children: "Ajouter une cat\xE9gorie" }), jsx(ae, { className: "size-5 text-gray-500" })] }), jsx(Popover.Portal, { children: jsx(Popover.Content, { className: "bg-white w-(--radix-popper-anchor-width)", sideOffset: 5, children: jsxs(Command, { className: "border rounded-sm border-gray-300", children: [jsx(Command.Input, { placeholder: "Rechercher une cat\xE9gorie", className: "w-full h-10 px-2 outline-none placeholder:text-sm placeholder:font-light" }), jsx(Command.Separator, { className: "h-px bg-gray-300" }), jsx(Command.List, { className: "max-h-60 overflow-y-auto", children: w.map((r) => jsx(Command.Item, { value: r.name, disabled: p.has(r.id), className: "cursor-pointer py-1.5 px-2 aria-selected:bg-gray-100 text-sm font-light aria-disabled:opacity-20", onSelect: () => _(r.id), children: r.name }, r.id)) })] }) }) })] })] }), jsx("ul", { className: "flex flex-wrap gap-2", children: Array.from(p).map((r) => {
    const t = w.find((l) => l.id === r);
    return t ? jsxs("li", { className: "bg-gray-400 text-white px-2 py-1 rounded-sm text-xs flex items-center gap-2", children: [jsx("span", { className: "max-w-[30ch] truncate", children: t.name }), jsx("button", { type: "button", className: "text-white inline-grid place-items-center cursor-pointer", onClick: () => q(t.id), children: jsx(e$1, { className: "size-3 text-white" }) })] }, t.id) : null;
  }) }), jsx(Separator.Root, { className: "h-px bg-gray-300 my-4" }), jsxs("div", { className: "grid gap-1", children: [jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Description" }), jsx("textarea", { name: "description", className: "border rounded-sm p-2 border-gray-300 resize-none placeholder:text-xs", rows: 4, placeholder: "Entrer une description de mon entreprise...", onChange: A })] }), jsxs("span", { className: "text-xs text-gray-500 justify-self-end", children: [F, "/1500"] })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Entrepreneur" }), jsx(l, { type: "text", name: "business_owner", placeholder: "Ex: Nom Pr\xE9nom", className: "placeholder:text-xs" })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Perim\xE8tre d'intervention" }), jsx(l, { type: "text", name: "service_area", placeholder: "Ex: Paris, Lyon, Marseille", className: "placeholder:text-xs" })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Sous-domaine" }), jsx(l, { type: "text", name: "subdomain", placeholder: "Ex: monentreprise", className: "placeholder:text-xs" })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Email" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(i, { className: "size-5 text-gray-500" }), jsx("input", { type: "email", name: "email", placeholder: "Ex: contact@monentreprise.com", className: "placeholder:text-xs outline-none w-full" })] })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Num\xE9ro de t\xE9l\xE9phone" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(r, { className: "size-5 text-gray-500" }), jsx("input", { type: "tel", name: "phone", placeholder: "Ex: 06 06 06 06 06", className: "placeholder:text-xs outline-none w-full" })] })] }), jsxs(m, { className: "flex flex-col gap-1", children: [jsx("span", { className: "text-xs font-medium", children: "Site web" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(o, { className: "size-5 text-gray-500" }), jsx("input", { type: "text", name: "website", placeholder: "Ex: https://www.monentreprise.com", className: "placeholder:text-xs outline-none w-full" })] })] }), jsx(Separator.Root, { className: "h-px bg-gray-300 my-4" }), jsxs("fieldset", { className: "flex flex-col gap-4", children: [jsx("legend", { className: "text-xs font-medium mb-2", children: "R\xE9seaux sociaux" }), jsxs(m, { children: [jsx("span", { className: "sr-only", children: "Linkedin" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(rt, { className: "size-5 text-gray-500" }), jsx("input", { type: "text", name: "linkedin", placeholder: "Ex: https://www.linkedin.com/company/monentreprise", className: "placeholder:text-xs outline-none w-full" })] })] }), jsxs(m, { children: [jsx("span", { className: "sr-only", children: "Facebook" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(e$2, { className: "size-5 text-gray-500" }), jsx("input", { type: "text", name: "facebook", placeholder: "Ex: https://www.facebook.com/monentreprise", className: "placeholder:text-xs outline-none w-full" })] })] }), jsxs(m, { children: [jsx("span", { className: "sr-only", children: "Instagram" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(h, { className: "size-5 text-gray-500" }), jsx("input", { type: "text", name: "instagram", placeholder: "Ex: https://www.instagram.com/monentreprise", className: "placeholder:text-xs outline-none w-full" })] })] }), jsxs(m, { children: [jsx("span", { className: "sr-only", children: "Calendly" }), jsxs("div", { className: "flex items-center gap-2 border rounded-sm border-gray-300 h-9 px-2 focus-within:border-gray-500", children: [jsx(n, { className: "size-5 text-gray-500" }), jsx("input", { type: "text", name: "calendly", placeholder: "Ex: https://calendly.com/monentreprise", className: "placeholder:text-xs outline-none w-full" })] })] })] }), jsx(Separator.Root, { className: "h-px bg-gray-300 my-4" }), jsxs("div", { className: "grid gap-8", children: [jsxs("fieldset", { className: "flex gap-4", children: [jsx("legend", { className: "text-xs font-medium mb-2", children: "Mode de travail" }), jsxs(m, { className: "flex items-center gap-1", children: [jsx(l, { type: "radio", name: "work_mode", value: "not_specified", defaultChecked: true, className: "size-4 accent-gray-600" }), jsx("span", { className: "text-xs", children: "Non sp\xE9cifi\xE9" })] }), jsxs(m, { className: "flex items-center gap-1", children: [jsx(l, { type: "radio", name: "work_mode", value: "remote", className: "size-4 accent-gray-600" }), jsx("span", { className: "text-xs", children: "\xC0 distance" })] }), jsxs(m, { className: "flex items-center gap-1", children: [jsx(l, { type: "radio", name: "work_mode", value: "onsite", className: "size-4 accent-gray-600" }), jsx("span", { className: "text-xs", children: "Sur site" })] }), jsxs(m, { className: "flex items-center gap-1", children: [jsx(l, { type: "radio", name: "work_mode", value: "hybrid", className: "size-4 accent-gray-600" }), jsx("span", { className: "text-xs", children: "Hybride" })] })] }), jsxs("fieldset", { className: "flex gap-2", children: [jsx("legend", { className: "text-xs font-medium mb-2", children: "RQTH" }), jsxs(m, { className: "flex items-center gap-1", children: [jsx(l, { type: "radio", name: "rqth", value: "true", className: "size-4 accent-gray-600" }), jsx("span", { className: "text-xs", children: "Oui" })] }), jsxs(m, { className: "flex items-center gap-1", children: [jsx(l, { type: "radio", name: "rqth", value: "false", className: "size-4 accent-gray-600" }), jsx("span", { className: "text-xs", children: "Non" })] })] })] }), jsx(Separator.Root, { className: "h-px bg-gray-300 my-4" }), jsxs("fieldset", { className: "border rounded-sm border-gray-300 p-4", children: [jsx("legend", { className: "text-xs font-medium  bg-white px-2", children: "Images" }), jsxs("div", { className: "flex gap-2 justify-center", children: [jsxs(m, { className: "relative flex flex-col gap-1 outline-none group", children: [jsx("span", { className: "text-xs font-medium", children: "Logo (max. 3MB)" }), jsxs("div", { className: "w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500", children: [i$1.logo ? jsx("img", { src: i$1.logo, alt: "Logo", className: "w-full h-full object-cover" }) : jsx(l$1, { className: "size-8 rounded-full bg-gray-400 p-1 text-white" }), jsx("input", { type: "file", className: "absolute inset-0 opacity-0", name: "logo", onChange: (r) => u$1(r, "logo"), accept: "image/*" })] })] }), jsxs(m, { className: "relative flex flex-col gap-1 outline-none group", children: [jsx("span", { className: "text-xs font-medium", children: "Image 1 (max. 2MB)" }), jsxs("div", { className: "w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500", children: [i$1.gallery[0] ? jsx("img", { src: i$1.gallery[0], alt: "gallery 1", className: "w-full h-full object-cover" }) : jsx(l$1, { className: "size-8 rounded-full bg-gray-400 p-1 text-white" }), jsx("input", { type: "file", className: "absolute inset-0 opacity-0", name: "gallery", onChange: (r) => u$1(r, "gallery", 0), accept: "image/*" })] })] }), jsxs(m, { className: "relative flex flex-col gap-1 outline-none group", children: [jsx("span", { className: "text-xs font-medium", children: "Image 2 (max. 2MB)" }), jsxs("div", { className: "w-35 h-40 bg-gray-100 border border-gray-300 rounded-sm grid place-items-center group-focus-within:border-gray-500", children: [i$1.gallery[1] ? jsx("img", { src: i$1.gallery[1], alt: "gallery 2", className: "w-full h-full object-cover" }) : jsx(l$1, { className: "size-8 rounded-full bg-gray-400 p-1 text-white" }), jsx("input", { type: "file", className: "absolute inset-0 opacity-0", name: "gallery", onChange: (r) => u$1(r, "gallery", 1), accept: "image/*" })] })] })] })] }), jsx(Separator.Root, { className: "h-px bg-gray-300 my-4" }), jsxs("div", { className: "flex gap-2 justify-end", children: [jsx(Link, { to: "/compte/entreprises/preview", className: "bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs", onClick: B, children: "Pr\xE9visualiser" }), jsx("button", { type: "submit", className: "bg-gray-800 text-white px-3 py-2 rounded-sm font-light text-xs", disabled: v, children: v ? "Cr\xE9ation en cours..." : "Cr\xE9er un compte" })] })] })] }) });
};

export { De as component };
//# sourceMappingURL=add-E_Tm_DAB.mjs.map
