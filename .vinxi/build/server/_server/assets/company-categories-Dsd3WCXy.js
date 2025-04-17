import{pgTable as r,jsonb as a,boolean as s,varchar as e,text as i,timestamp as o,uuid as n,index as d,primaryKey as c}from"drizzle-orm/pg-core";import{sql as u}from"drizzle-orm";import{u as l}from"./auth.server-CEln8Kin.js";import{c as m}from"./categories-BGVwlHfX.js";const p=r("companies",{id:n("id").primaryKey().defaultRandom(),status:e("status").$type().notNull().default("pending"),created_at:o("created_at").notNull().defaultNow(),updated_at:o("updated_at").notNull().defaultNow(),created_by:i("created_by").references(()=>l.id,{onDelete:"cascade"}).notNull(),user_id:i("user_id").references(()=>l.id,{onDelete:"cascade"}).notNull(),name:e("name",{length:255}).notNull().unique(),siret:e("siret",{length:14}).notNull(),business_owner:e("business_owner",{length:255}),description:e("description",{length:1500}),website:e("website",{length:255}),location:e("location",{length:255}),service_area:e("service_area",{length:255}),subdomain:e("subdomain",{length:100}),work_mode:e("work_mode").$type(),email:e("email",{length:255}),phone:e("phone",{length:24}),rqth:s("rqth").notNull().default(!1),logo:a("logo").$type(),gallery:a("gallery").$type(),social_media:a("social_media").$type().notNull().default({facebook:"",calendly:"",linkedin:"",instagram:""})},t=>[d("company_search_index").using("gin",u`to_tsvector('french', ${t.name} || ' ' || ${t.subdomain} || ' ' || ${t.description})`)]),h=["remote","hybrid","onsite","not_specified"],N=r("company_categories",{company_id:n("company_id").notNull().references(()=>p.id,{onDelete:"cascade"}),category_id:n("category_id").notNull().references(()=>m.id,{onDelete:"cascade"}),created_at:o("created_at").notNull().defaultNow()},t=>[c({columns:[t.company_id,t.category_id]})]);export{h as C,N as a,p as c};
