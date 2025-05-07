import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { user } from "~/db/schema/auth";

/**
 * Get all users
 */
export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const users = await db.select().from(user).orderBy(user.name);
  return users;
});

export const usersQuery = queryOptions({
  queryKey: ["users"],
  queryFn: () => getUsers(),
});
