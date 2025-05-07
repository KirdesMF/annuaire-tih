import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { admin, customSession } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { Resend } from "resend";
import { db } from "~/db";
import { account, session, user, verification } from "~/db/schema/auth";

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
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
    admin({ adminRoles: ["admin", "superadmin"] }),
    customSession(async ({ user: currentUser, session }) => {
      const activeCGU = await db.query.cguTable.findFirst({
        where: (cgu, { eq }) => eq(cgu.isActive, true),
      });

      if (!activeCGU) {
        return {
          session,
          user: { ...currentUser, cgu: false },
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
        user: { ...currentUser, cgu: hasAcceptedCGU },
      };
    }),
    reactStartCookies(),
  ],
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

export type AuthSession = typeof auth.$Infer.Session;
