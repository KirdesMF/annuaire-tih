import { pgTable, timestamp, boolean, varchar, uuid } from 'drizzle-orm/pg-core';

const d = pgTable("categories", { id: uuid("id").primaryKey().defaultRandom(), name: varchar("name", { length: 255 }).notNull().unique(), is_active: boolean("is_active").notNull().default(true), created_at: timestamp("created_at").notNull().defaultNow(), updated_at: timestamp("updated_at").notNull().defaultNow() });

export { d };
//# sourceMappingURL=categories-BGVwlHfX.mjs.map
