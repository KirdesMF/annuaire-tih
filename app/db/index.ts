import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/react-start/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as analyticsSchema from "./schema/analytics";
import * as authSchema from "./schema/auth";
import * as categoriesSchema from "./schema/categories";
import * as cguSchema from "./schema/cgu";
import * as companiesSchema from "./schema/companies";
import * as companyCategoriesSchema from "./schema/company-categories";

export type DbConnectionMode = "auto" | "direct" | "hyperdrive";

type HyperdriveBinding = { connectionString: string };

type CloudflareEnv = {
  DATABASE_URL?: string;
  HYPERDRIVE?: HyperdriveBinding;
};

const schema = {
  ...analyticsSchema,
  ...authSchema,
  ...cguSchema,
  ...companyCategoriesSchema,
  ...companiesSchema,
  ...categoriesSchema,
};

type Db = ReturnType<typeof createDb>;

const dbByRequest = new WeakMap<Request, Db>();
let localDb: Db | undefined;

function getCloudflareEnv(): CloudflareEnv {
  return env as CloudflareEnv;
}

function getConnectionString(mode: DbConnectionMode = "auto"): string {
  const cloudflareEnv = getCloudflareEnv();
  const connectionStringByMode: Record<DbConnectionMode, string | undefined> = {
    auto: cloudflareEnv.HYPERDRIVE?.connectionString ?? cloudflareEnv.DATABASE_URL,
    direct: cloudflareEnv.DATABASE_URL,
    hyperdrive: cloudflareEnv.HYPERDRIVE?.connectionString,
  };

  const connectionString = connectionStringByMode[mode];

  if (!connectionString) {
    throw new Error(`${mode} database connection string is not set`);
  }

  return connectionString;
}

function createDb(connectionString: string) {
  const client = postgres(connectionString, {
    prepare: false,
    fetch_types: false,
    max: 1,
    idle_timeout: 2,
    connect_timeout: 10,
  });

  return drizzle({ client, schema });
}

function getCurrentRequest(): Request | undefined {
  try {
    return getRequest();
  } catch {
    return undefined;
  }
}

export function getDb(mode: DbConnectionMode = "auto"): Db {
  const connectionString = getConnectionString(mode);
  const request = getCurrentRequest();

  if (!request) {
    localDb ??= createDb(connectionString);
    return localDb;
  }

  if (mode !== "auto") {
    return createDb(connectionString);
  }

  const cachedDb = dbByRequest.get(request);

  if (cachedDb) return cachedDb;

  const db = createDb(connectionString);
  dbByRequest.set(request, db);

  return db;
}
