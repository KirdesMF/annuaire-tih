import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "~/db";
import { user } from "~/db/schema/auth";
import { requireAdminUser } from "~/lib/auth/permissions.server";

/**
 * Get all users
 */
export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminUser();

  const db = getDb();
  const users = await db.select().from(user).orderBy(user.name);
  return users;
});

export const usersQuery = queryOptions({
  queryKey: ["users"],
  queryFn: () => getUsers(),
});
