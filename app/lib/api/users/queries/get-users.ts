import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest, setResponseHeader, setResponseStatus } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import { getDb } from "~/db";
import { user } from "~/db/schema/auth";

/** Get the account directory for authenticated administrators only. */
export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  setResponseHeader("Cache-Control", "no-store");
  const request = getWebRequest();
  const session = request
    ? await auth().api.getSession({
        headers: request.headers,
        query: { disableCookieCache: true },
      })
    : null;

  if (!session) {
    setResponseStatus(401);
    throw new Error("Authentification requise");
  }

  if (session.user.role !== "admin" && session.user.role !== "superadmin") {
    setResponseStatus(403);
    throw new Error("Accès réservé aux administrateurs");
  }

  return getDb()
    .select({ id: user.id, name: user.name, email: user.email, role: user.role })
    .from(user)
    .orderBy(user.name, user.email);
});

export const usersQuery = queryOptions({
  queryKey: ["users"],
  queryFn: () => getUsers(),
});
