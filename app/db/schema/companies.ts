import {
	pgTable,
	uuid,
	timestamp,
	index,
	varchar,
	boolean,
	jsonb,
	text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { nanoid } from "nanoid";
export const companiesTable = pgTable(
	"companies",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => nanoid(32)),
		status: varchar("status").$type<CompanyStatus>().notNull().default("pending"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
		created_by: text("created_by")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		user_id: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		name: varchar("name", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 100 }).notNull().unique(),
		siret: varchar("siret", { length: 14 }).notNull(),
		business_owner: varchar("business_owner", { length: 255 }),
		description: varchar("description", { length: 1500 }),
		website: varchar("website", { length: 255 }),
		location: varchar("location", { length: 255 }),
		service_area: varchar("service_area", { length: 255 }),
		subdomain: varchar("subdomain", { length: 100 }),
		work_mode: varchar("work_mode").$type<CompanyWorkMode>(),
		email: varchar("email", { length: 255 }),
		phone: varchar("phone", { length: 24 }),
		rqth: boolean("rqth").notNull().default(false),
		logo: jsonb("logo").$type<CompanyImage | null>(),
		gallery: jsonb("gallery").$type<CompanyGallery | null>(),
		social_media: jsonb("social_media").$type<CompanySocialMedia>().notNull().default({
			facebook: "",
			calendly: "",
			linkedin: "",
			instagram: "",
		}),
	},
	(table) => [
		index("company_search_index").using(
			"gin",
			sql`to_tsvector('french', ${table.name} || ' ' || ${table.subdomain} || ' ' || ${table.description})`,
		),
	],
);

export type NewCompany = typeof companiesTable.$inferInsert; // type for creating a new company
export type Company = typeof companiesTable.$inferSelect; // type for selecting a company

export const COMPANY_STATUSES = ["pending", "active", "rejected"] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];
export const isValidCompanyStatus = (status: string): status is CompanyStatus => {
	return COMPANY_STATUSES.includes(status as CompanyStatus);
};

export const COMPANY_WORK_MODES = ["remote", "hybrid", "onsite", "not_specified"] as const;
export type CompanyWorkMode = (typeof COMPANY_WORK_MODES)[number];
export const isValidCompanyWorkMode = (workMode: string): workMode is CompanyWorkMode => {
	return COMPANY_WORK_MODES.includes(workMode as CompanyWorkMode);
};

export type CompanyImage = {
	publicId: string;
	secureUrl: string;
};
export type CompanyGallery = Array<CompanyImage>;

export type CompanySocialMedia = {
	facebook: string;
	calendly: string;
	linkedin: string;
	instagram: string;
};
