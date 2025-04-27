import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env" });

export function getDb() {
  const client = postgres(process.env.DATABASE_URL as string, { prepare: false });
  const db = drizzle(client);
  return db;
}
