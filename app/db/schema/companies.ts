import { pgTable, uuid, text, timestamp, pgEnum, index, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { sql } from "drizzle-orm";
import { companyStatusEnum } from "./enums";

export const companiesTable = pgTable(
	"companies",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		description: varchar("description", { length: 1500 }),
		website: varchar("website", { length: 255 }),
		location: varchar("location", { length: 255 }),
		subdomain: varchar("subdomain", { length: 100 }),
		created_by: uuid("created_by").references(() => usersTable.id),
		status: companyStatusEnum("status").notNull().default("pending"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
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
