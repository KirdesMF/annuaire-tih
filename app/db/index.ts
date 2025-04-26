import { drizzle } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env" });

// Check for Cloudflare Worker environment
const isCloudflare = typeof process === "undefined";

const client = postgres(process.env.DATABASE_URL as string, { prepare: false });
export const db = isCloudflare
  ? drizzleNeon(process.env.DATABASE_URL as string)
  : drizzlePg(client);
