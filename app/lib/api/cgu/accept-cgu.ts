import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { userCguAcceptanceTable } from "~/db/schema/cgu";
import { requireCurrentUser } from "~/lib/auth/permissions.server";

export const acceptCurrentCguFn = createServerFn({ method: "POST" }).handler(async () => {
  const user = await requireCurrentUser();
  const db = getDb();

  await db.transaction(async (tx) => {
    const activeCGU = await tx.query.cguTable.findFirst({
      where: (cgu, { eq }) => eq(cgu.isActive, true),
    });

    if (!activeCGU) {
      throw new Error("No active CGU found");
    }

    const existingAcceptance = await tx.query.userCguAcceptanceTable.findFirst({
      where: (userCguAcceptance, { and }) =>
        and(eq(userCguAcceptance.userId, user.id), eq(userCguAcceptance.cguId, activeCGU.id)),
    });

    if (existingAcceptance) return;

    await tx.insert(userCguAcceptanceTable).values({
      userId: user.id,
      cguId: activeCGU.id,
      acceptedAt: new Date(),
    });
  });
});
