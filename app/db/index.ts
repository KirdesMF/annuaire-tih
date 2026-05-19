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

const clientsByRequest = new WeakMap<Request, postgres.Sql>();
let localClient: postgres.Sql | undefined;

function getCloudflareEnv() {
  return env as CloudflareEnv;
}

function getConnectionString(mode: DbConnectionMode = "auto") {
  const cloudflareEnv = getCloudflareEnv();
  const connectionString =
    mode === "direct"
      ? cloudflareEnv.DATABASE_URL
      : mode === "hyperdrive"
        ? cloudflareEnv.HYPERDRIVE?.connectionString
        : (cloudflareEnv.HYPERDRIVE?.connectionString ?? cloudflareEnv.DATABASE_URL);

  if (!connectionString) {
    throw new Error(`${mode} database connection string is not set`);
  }

  return connectionString;
}

function createClient(connectionString: string) {
  return postgres(connectionString, {
    prepare: false,
    fetch_types: false,
    max: 1,
    idle_timeout: 2,
    connect_timeout: 10,
  });
}

function getCurrentRequest() {
  try {
    return getRequest();
  } catch {
    return undefined;
  }
}

export function getDb(mode: DbConnectionMode = "auto") {
  const connectionString = getConnectionString(mode);
  const request = getCurrentRequest();

  if (!request) {
    if (getCloudflareEnv().HYPERDRIVE) {
      console.warn("getDb() called outside TanStack request context in Cloudflare runtime");
      return drizzle({ client: createClient(connectionString), schema });
    }

    localClient ??= createClient(connectionString);
    return drizzle({ client: localClient, schema });
  }

  if (mode !== "auto") {
    return drizzle({ client: createClient(connectionString), schema });
  }

  let client = clientsByRequest.get(request);
  if (!client) {
    client = createClient(connectionString);
    clientsByRequest.set(request, client);
  }

  return drizzle({ client, schema });
}
