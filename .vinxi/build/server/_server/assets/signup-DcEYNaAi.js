import{jsxs as p,jsx as i}from"react/jsx-runtime";import{redirect as s,createFileRoute as m,lazyRouteComponent as c}from"@tanstack/react-router";import{APIError as l}from"better-auth/api";import*as e from"valibot";import{Resend as u}from"resend";import{a as d}from"./auth.server-CEln8Kin.js";import{c as g}from"./index-8Htcofqc.js";import{createServerFn as v}from"@tanstack/start-client-core";import"better-auth";import"better-auth/adapters/drizzle";import"better-auth/plugins";import"drizzle-orm/pg-core";import"better-auth/react-start";import"tiny-invariant";import"drizzle-orm/postgres-js";import"postgres";import"dotenv";const h=()=>import("./signup-C_1YHVpu.js"),f=e.object({email:e.pipe(e.string(),e.nonEmpty("Veuillez entrer votre email"),e.email("Veuillez entrer un email valide")),password:e.pipe(e.string(),e.minLength(8,"Le mot de passe doit contenir au moins 8 caractères"),e.maxLength(100,"Le mot de passe doit contenir au plus 100 caractères")),firstName:e.pipe(e.string(),e.nonEmpty("Veuillez entrer votre prénom"),e.maxLength(100,"Le prénom doit contenir au plus 100 caractères")),lastName:e.pipe(e.string(),e.nonEmpty("Veuillez entrer votre nom"),e.maxLength(100,"Le nom doit contenir au plus 100 caractères"))}),_=g("app_routes_auth_signup_tsx--signupFn_createServerFn_handler","/_server",(r,t)=>L.__executeServer(r,t)),L=v().validator(r=>e.parse(f,r)).handler(_,async({data:r})=>{try{await d.api.signUpEmail({body:{email:r.email,password:r.password,name:`${r.firstName} ${r.lastName}`}})}catch(n){if(n instanceof l)return{status:"error",message:n.message}}const t=new u(process.env.RESEND_API_KEY),{data:a,error:o}=await t.emails.send({from:"Acme <onboarding@resend.dev>",to:"cedgourville@gmail.com",subject:"Bienvenue sur l'application de gestion de projet",react:p("div",{children:[i("h1",{children:"Bienvenue sur l'application de gestion de projet"}),i("p",{children:"Votre compte a été créé avec succès"})]})});throw o&&console.error(o),console.log(a),s({to:"/compte/entreprises"})}),w=m("/_auth/signup")({component:c(h,"component",()=>w.ssr),beforeLoad:async({context:r})=>{if(r.session?.user)throw s({to:"/compte/entreprises"})}});export{_ as signupFn_createServerFn_handler};
