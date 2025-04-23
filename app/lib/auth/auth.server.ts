import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "~/db";
import { user, session, account, verification } from "~/db/schema/auth";
import { reactStartCookies } from "better-auth/react-start";
import { Resend } from "resend";
import { toast } from "sonner";

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
