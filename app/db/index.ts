import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./schema/auth";
import * as categoriesSchema from "./schema/categories";
import * as cguSchema from "./schema/cgu";
import * as companiesSchema from "./schema/companies";
import * as companyCategoriesSchema from "./schema/company-categories";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL as string, { prepare: false });
export const db = drizzle({
  client,
  schema: {
    ...authSchema,
    ...cguSchema,
    ...companyCategoriesSchema,
    ...companiesSchema,
    ...categoriesSchema,
  },
});
