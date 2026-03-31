import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";

export const updateUserRoleFn = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: string; role: "admin" | "user" }) => data)
  .handler(async ({ data }) => {
    await auth().api.setRole({
      body: { userId: data.userId, role: data.role },
      headers: getRequest().headers,
    });
  });
