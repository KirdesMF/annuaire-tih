import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { categoriesTable } from "./categories";
import { companiesTable } from "./companies";

export const companyCategoriesTable = pgTable(
  "company_categories",
  {
    company_id: text("company_id")
      .notNull()
      .references(() => companiesTable.id, { onDelete: "cascade" }),
    category_id: text("category_id")
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.company_id, table.category_id] })],
);

export type NewCompanyCategory = typeof companyCategoriesTable.$inferInsert;
export type CompanyCategory = typeof companyCategoriesTable.$inferSelect;
