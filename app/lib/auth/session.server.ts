import type { getDb } from "~/db";

export type CustomSessionUser = { id: string; role?: string };

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
      columns: { role: true },
    });

    return { session, user: { ...currentUser, role: user?.role } };
  };
}
