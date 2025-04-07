import { pgEnum } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", ["admin", "user"]);
export const companyStatusEnum = pgEnum("company_status", ["pending", "approved", "rejected"]);
