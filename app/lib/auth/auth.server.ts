import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, customSession } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getDb } from "~/db";
import type { UserRole } from "~/db/schema/auth";
import { account, session, user, verification } from "~/db/schema/auth";
import { sendEmail } from "~/lib/email.server";
import { authAc, authRoles } from "./access-control.server";
import { passwordHelpers } from "./password.server";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./password-policy";
import { createCustomSession } from "./session.server";

export function auth() {
  const db = getDb();

  return betterAuth({
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
      admin({
        adminRoles: ["admin"] as const,
        defaultRole: "user",
        ac: authAc,
        roles: authRoles,
      }),
      customSession(createCustomSession({ db })),
      tanstackStartCookies(),
    ] as const,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
      revokeSessionsOnPasswordReset: true,
      password: passwordHelpers,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Réinitialisation de mot de passe",
          text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${url}`,
        });
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
      changeEmail: {
        enabled: true,
      },
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
        },
      },
    },
  });
}

export type AuthSession = Awaited<ReturnType<typeof auth>>["$Infer"]["Session"];
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  cgu?: boolean;
  role?: UserRole;
};
