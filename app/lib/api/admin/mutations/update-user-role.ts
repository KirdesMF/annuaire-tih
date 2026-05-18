import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, count, eq, ne } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { user } from "~/db/schema/auth";
import { auth } from "~/lib/auth/auth.server";
import { requireAdminUser } from "~/lib/auth/permissions.server";

const UpdateUserRoleSchema = v.object({
  userId: v.pipe(v.string(), v.nonEmpty()),
  role: v.picklist(["admin", "user"]),
});

async function hasOtherAdmin(userId: string): Promise<boolean> {
  const [result] = await getDb()
    .select({ value: count() })
    .from(user)
    .where(and(eq(user.role, "admin"), ne(user.id, userId)));

  return (result?.value ?? 0) > 0;
}

export const updateUserRoleFn = createServerFn({ method: "POST" })
  .inputValidator(UpdateUserRoleSchema)
  .handler(async ({ data }) => {
    const currentUser = await requireAdminUser();

    if (data.role === "user" && currentUser.id === data.userId) {
      throw new Error("Impossible de retirer votre propre rôle administrateur");
    }

    if (data.role === "user" && !(await hasOtherAdmin(data.userId))) {
      throw new Error("Impossible de retirer le dernier administrateur");
    }

    await auth().api.setRole({
      body: { userId: data.userId, role: data.role },
      headers: getRequest().headers,
    });
  });
