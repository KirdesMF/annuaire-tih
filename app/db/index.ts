import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as analyticsSchema from "./schema/analytics";
import * as authSchema from "./schema/auth";
import * as categoriesSchema from "./schema/categories";
import * as cguSchema from "./schema/cgu";
import * as companiesSchema from "./schema/companies";
import * as companyCategoriesSchema from "./schema/company-categories";

type CloudflareEnv = {
  DATABASE_URL?: string;
  HYPERDRIVE?: { connectionString: string };
};

const schema = {
  ...analyticsSchema,
  ...authSchema,
  ...cguSchema,
  ...companyCategoriesSchema,
  ...companiesSchema,
  ...categoriesSchema,
};

export function getDb() {
  const cloudflareEnv = env as CloudflareEnv;
  const connectionString = cloudflareEnv.HYPERDRIVE?.connectionString ?? cloudflareEnv.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  // Cloudflare bindings are per-request. Keep Postgres.js pool tiny so Worker/Hyperdrive slots do not hang.
  const client = postgres(connectionString, {
    prepare: false,
    fetch_types: false,
    max: 1,
    idle_timeout: 2,
    connect_timeout: 10,
  });
  return drizzle({ client, schema });
}
