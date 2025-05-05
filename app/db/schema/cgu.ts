import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const cguTable = pgTable("cgu", {
  id: serial("id").primaryKey(),
  version: varchar("version", { length: 255 }).notNull(),
  content: text("content"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userCguAcceptanceTable = pgTable(
  "user_cgu_acceptance",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    cguId: integer("cgu_id")
      .notNull()
      .references(() => cguTable.id, {
        onDelete: "cascade",
      }),
    acceptedAt: timestamp("accepted_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cguId] })],
);
