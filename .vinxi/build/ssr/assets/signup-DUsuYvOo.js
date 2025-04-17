import{jsxs as t,jsx as r}from"react/jsx-runtime";import{useMutation as l}from"@tanstack/react-query";import{L as a,I as o}from"./label-B1qOmGit.js";import*as e from"valibot";import{s as c}from"./ssr-B2yzgCJC.js";import{u as d}from"./useServerFn-DtzmTnlI.js";import"./cn-bhneXptQ.js";import"clsx";import"tailwind-merge";import"@tanstack/react-router";import"better-auth/react";import"better-auth/client/plugins";import"radix-ui";import"react";import"drizzle-orm/pg-core";import"sonner";import"@tanstack/react-query-devtools";import"@tanstack/router-core";import"@tanstack/start-client-core";import"@tanstack/start-server-core";import"drizzle-orm";import"decode-formdata";import"@tanstack/react-router-with-query";import"tiny-invariant";import"node:stream";import"isbot";import"react-dom/server";e.object({email:e.pipe(e.string(),e.nonEmpty("Veuillez entrer votre email"),e.email("Veuillez entrer un email valide")),password:e.pipe(e.string(),e.minLength(8,"Le mot de passe doit contenir au moins 8 caractères"),e.maxLength(100,"Le mot de passe doit contenir au plus 100 caractères")),firstName:e.pipe(e.string(),e.nonEmpty("Veuillez entrer votre prénom"),e.maxLength(100,"Le prénom doit contenir au plus 100 caractères")),lastName:e.pipe(e.string(),e.nonEmpty("Veuillez entrer votre nom"),e.maxLength(100,"Le nom doit contenir au plus 100 caractères"))});const G=function(){const{mutate:s,isPending:m}=l({mutationFn:d(c)});function p(n){n.preventDefault();const i=new FormData(n.target);s({data:{email:i.get("email"),password:i.get("password"),firstName:i.get("firstName"),lastName:i.get("lastName")}})}return t("main",{className:"py-12",children:[r("h1",{className:"text-2xl font-bold text-center mb-6",children:"Créer un compte"}),r("div",{className:"max-w-lg mx-auto border border-gray-200 p-6 rounded-sm shadow-sm",children:t("form",{className:"flex flex-col gap-6",onSubmit:p,children:[t("div",{className:"grid gap-4",children:[t(a,{className:"flex flex-col gap-1",children:[r("span",{children:"Nom*"}),r(o,{name:"lastName",type:"text",required:!0})]}),t(a,{className:"flex flex-col gap-1",children:[r("span",{children:"Prénom*"}),r(o,{name:"firstName",type:"text",required:!0})]}),t(a,{className:"flex flex-col gap-1",children:[r("span",{children:"Email*"}),r(o,{name:"email",type:"email",required:!0})]}),t(a,{className:"flex flex-col gap-1",children:[r("span",{children:"Mot de passe*"}),r(o,{name:"password",type:"password",required:!0})]}),t(a,{className:"flex flex-col gap-1",children:[r("span",{children:"Confirmation du mot de passe*"}),r(o,{name:"confirmPassword",type:"password",required:!0})]})]}),r("button",{type:"submit",className:"border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors p-2 rounded-sm font-medium text-sm",disabled:m,children:m?"Création en cours...":"S'inscrire"})]})})]})};export{G as component};
