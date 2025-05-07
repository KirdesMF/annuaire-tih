import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const request = getWebRequest();
  if (!request) return;
  await auth().api.signOut({ headers: request.headers });
  throw redirect({ to: "/" });
});
