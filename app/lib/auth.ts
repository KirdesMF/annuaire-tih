import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "~/db";
import { user, session, account, verification } from "~/db/schema/auth";
import { tanstackStartCookies } from "./plugins/tanstack-start-cookies";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    admin({ adminRoles: ["admin", "superadmin"] }),
    tanstackStartCookies(),
  ],
  advanced: {
    generateId: false,
  },
  emailAndPassword: {
    enabled: true,
  },
});
