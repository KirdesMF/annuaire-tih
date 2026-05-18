import type { getDb } from "~/db";

type Db = ReturnType<typeof getDb>;

type CreateCustomSessionOptions = {
  db: Db;
};

export function createCustomSession({ db }: CreateCustomSessionOptions) {
  return async function customSession<TUser extends { id: string }, TSession>({
    user: currentUser,
    session,
  }: {
    user: TUser;
    session: TSession;
  }) {
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
  };
}
