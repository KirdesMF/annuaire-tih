import { createServerFn } from "@tanstack/react-start";

export const getCurrentCguAcceptanceFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getDb } = await import("~/db");
  const { requireCurrentUser } = await import("~/lib/auth/permissions.server");

  const user = await requireCurrentUser();
  const db = getDb();

  const activeCGU = await db.query.cguTable.findFirst({
    where: (cgu, { eq }) => eq(cgu.isActive, true),
    columns: { id: true },
  });

  if (!activeCGU) return false;

  const userCGU = await db.query.userCguAcceptanceTable.findFirst({
    where: (userCguAcceptance, { eq, and }) =>
      and(eq(userCguAcceptance.userId, user.id), eq(userCguAcceptance.cguId, activeCGU.id)),
    columns: { userId: true },
  });

  return !!userCGU;
});
