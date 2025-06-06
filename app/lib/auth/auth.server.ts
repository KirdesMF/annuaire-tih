import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, customSession } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { Resend } from "resend";
import { getDb } from "~/db";
import { account, session, user, verification } from "~/db/schema/auth";

const passwordHelpers = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  },
  verify: async ({ hash, password }: { hash: string; password: string }) => {
    const [salt, key] = hash.split(":");
    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return timingSafeEqual(hashedBuffer, keyBuffer);
  },
};

// @todo: use relational queries instead of raw queries
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
      admin({ adminRoles: ["admin", "superadmin"] }),
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
      reactStartCookies(),
    ],
    emailAndPassword: {
      enabled: true,
      password: passwordHelpers,
      sendResetPassword: async ({ user, url, token }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: "noreply@annuaire-tih.fr",
          to: user.email,
          subject: "Réinitialisation de mot de passe",
          text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${url}`,
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
      additionalFields: {
        role: {
          type: "string",
        },
      },
    },
  });
}

export type AuthSession = Awaited<ReturnType<typeof auth>>["$Infer"]["Session"];
