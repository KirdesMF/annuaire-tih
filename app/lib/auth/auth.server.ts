import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "~/db";
import { user, session, account, verification } from "~/db/schema/auth";
import { reactStartCookies } from "better-auth/react-start";

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
  plugins: [admin({ adminRoles: ["admin", "superadmin"] }), reactStartCookies()],
  // advanced: {
  // 	database: {
  // 		generateId: false,
  // 	}
  // },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
