import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "~/db";
import { user } from "~/db/schema/auth";

/**
 * Get all users
 */
export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const users = await getDb().select().from(user);
  return users;
});

export const usersQuery = queryOptions({
  queryKey: ["users"],
  queryFn: () => getUsers(),
});
