import { pgTable, varchar, timestamp, uuid, boolean, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const categoriesTable = pgTable("categories", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid(32)),
	name: varchar("name", { length: 255 }).notNull().unique(),
	is_active: boolean("is_active").notNull().default(true),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type NewCategory = typeof categoriesTable.$inferInsert; // type for creating a new category
export type Category = typeof categoriesTable.$inferSelect; // type for selecting a category
