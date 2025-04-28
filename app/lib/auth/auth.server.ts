import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { Resend } from "resend";
import { getDb } from "~/db";
import { account, session, user, verification } from "~/db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), {
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
    password: {
      hash: async (password) => {
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        return `${salt}:${hash}`;
      },
      verify: async ({ hash, password }) => {
        const [salt, key] = hash.split(":");
        const hashedBuffer = scryptSync(password, salt, 64);
        const keyBuffer = Buffer.from(key, "hex");
        return timingSafeEqual(hashedBuffer, keyBuffer);
      },
    },
    sendResetPassword: async ({ user, url, token }) => {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        text: `Click ${url} to reset your password`,
      });

      if (error) {
        console.error(error);
      }

      console.log(data);
    },
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
