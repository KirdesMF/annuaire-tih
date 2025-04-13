import { pgTable, uuid, timestamp, index, varchar, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { companyStatusEnum } from "./enums";
import { user } from "./auth";

export type CompanySocialMedia = {
	facebook?: string;
	calendly?: string;
	linkedin?: string;
	instagram?: string;
};

export const COMPANY_STATUSES = ["pending", "active", "rejected"] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export type CompanyImage = {
	publicId: string;
	secureUrl: string;
};

export type CompanyGallery = Array<CompanyImage>;

export const isValidCompanyStatus = (status: string): status is CompanyStatus => {
	return COMPANY_STATUSES.includes(status as CompanyStatus);
};

export const companiesTable = pgTable(
	"companies",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		description: varchar("description", { length: 1500 }),
		website: varchar("website", { length: 255 }),
		location: varchar("location", { length: 255 }),
		subdomain: varchar("subdomain", { length: 100 }),
		created_by: uuid("created_by")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		status: varchar("status", { length: 100 }).$type<CompanyStatus>().notNull().default("pending"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
		siret: varchar("siret", { length: 14 }).notNull(),
		user_id: uuid("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		email: varchar("email", { length: 255 }),
		phone: varchar("phone", { length: 24 }),
		logo: jsonb("logo").$type<CompanyImage | null>(),
		gallery: jsonb("gallery").$type<CompanyGallery | null>(),
		rqth: boolean("rqth").notNull().default(false),
		social_media: jsonb("social_media").$type<CompanySocialMedia | null>(),
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
