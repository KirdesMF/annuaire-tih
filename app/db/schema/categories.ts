import { pgTable, varchar, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	is_active: boolean("is_active").notNull().default(true),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type NewCategory = typeof categoriesTable.$inferInsert; // type for creating a new category
export type Category = typeof categoriesTable.$inferSelect; // type for selecting a category
