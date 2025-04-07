import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { categoriesTable } from "./categories";

export const companyCategoriesTable = pgTable(
	"company_categories",
	{
		company_id: uuid("company_id").references(() => companiesTable.id, { onDelete: "cascade" }),
		category_id: uuid("category_id").references(() => categoriesTable.id, { onDelete: "cascade" }),
		created_at: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.company_id, table.category_id] })],
);

export type NewCompanyCategory = typeof companyCategoriesTable.$inferInsert;
export type CompanyCategory = typeof companyCategoriesTable.$inferSelect;
