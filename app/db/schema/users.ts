import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { rolesEnum } from "./enums";

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	first_name: varchar("first_name", { length: 255 }).notNull(),
	last_name: varchar("last_name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	role: rolesEnum("role").default("user").notNull(),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").defaultNow(),
});

export type NewUser = typeof usersTable.$inferInsert; // type for creating a new user
export type User = typeof usersTable.$inferSelect; // type for selecting a user
