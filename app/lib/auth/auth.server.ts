import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, customSession } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Resend } from "resend";
import { getDb } from "~/db";
import type { UserRole } from "~/db/schema/auth";
import { account, session, user, verification } from "~/db/schema/auth";

const passwordHelpers = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  },
  verify: async ({ hash, password }: { hash: string; password: string }) => {
    const [salt, key] = hash.split(":");

    if (!salt || !key) return false;

    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");

    if (hashedBuffer.length !== keyBuffer.length) return false;

    return timingSafeEqual(hashedBuffer, keyBuffer);
  },
};

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
      admin({ adminRoles: ["admin"] as const }),
      customSession(async ({ user: currentUser, session }) => {
        const user = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.id, currentUser.id),
          columns: {
            role: true,
          },
        });

        const activeCGU = await db.query.cguTable.findFirst({
          where: (cgu, { eq }) => eq(cgu.isActive, true),
        });

        if (!activeCGU) {
          return {
            session,
            user: { ...currentUser, cgu: false, role: user?.role },
          };
        }

        const userCGU = await db.query.userCguAcceptanceTable.findFirst({
          where: (userCguAcceptance, { eq, and }) =>
            and(
              eq(userCguAcceptance.userId, currentUser.id),
              eq(userCguAcceptance.cguId, activeCGU.id),
            ),
        });

        const hasAcceptedCGU = !!userCGU;

        return {
          session,
          user: { ...currentUser, cgu: hasAcceptedCGU, role: user?.role },
        };
      }),
      tanstackStartCookies(),
    ] as const,
    emailAndPassword: {
      enabled: true,
      password: passwordHelpers,
      sendResetPassword: async ({ user, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
          from: "noreply@annuaire-tih.fr",
          to: user.email,
          subject: "Réinitialisation de mot de passe",
          text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${url}`,
        });

        if (error) {
          throw new Error("Failed to send reset password email", {
            cause: error,
          });
        }
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
