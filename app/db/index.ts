import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./schema/auth";
import * as categoriesSchema from "./schema/categories";
import * as cguSchema from "./schema/cgu";
import * as companiesSchema from "./schema/companies";
import * as companyCategoriesSchema from "./schema/company-categories";

let _client: postgres.Sql | undefined;

const schema = {
  ...authSchema,
  ...cguSchema,
  ...companyCategoriesSchema,
  ...companiesSchema,
  ...categoriesSchema,
};

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // for cloudflare workers, we need to create a new client for each request
  if (process.env.CLOUDFLARE_WORKER) {
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    return drizzle({ client, schema });
  }

  if (!_client) {
    _client = postgres(process.env.DATABASE_URL, {
      prepare: false,
      max: 10,
      idle_timeout: 30,
    });
  }

  return drizzle({ client: _client, schema });
}

if (typeof process !== "undefined" && !process.env.CLOUDFLARE_WORKER) {
  process.on("SIGINT", () => {
    if (_client) {
      console.log("🔒 closing database connection");
      _client.end();
    }
    process.exit(0);
  });
}
