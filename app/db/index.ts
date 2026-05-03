import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as analyticsSchema from "./schema/analytics";
import * as authSchema from "./schema/auth";
import * as categoriesSchema from "./schema/categories";
import * as cguSchema from "./schema/cgu";
import * as companiesSchema from "./schema/companies";
import * as companyCategoriesSchema from "./schema/company-categories";

let _client: postgres.Sql | undefined;

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

  // Cloudflare bindings are per-request. Do not cache clients in module scope in Workers.
  const client = postgres(connectionString, { prepare: false });
  return drizzle({ client, schema });
}

if (typeof process !== "undefined") {
  process.on("SIGINT", () => {
    if (_client) {
      console.log("🔒 closing database connection");
      _client.end();
    }
    process.exit(0);
  });
}
