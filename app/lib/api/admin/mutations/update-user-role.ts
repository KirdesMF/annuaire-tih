import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { UserRole } from "~/db/schema/auth";
import { auth } from "~/lib/auth/auth.server";

export const updateUserRoleFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string; role: UserRole }) => data)
  .handler(async ({ data }) => {
    await auth.api.setRole({
      body: { userId: data.userId, role: data.role },
      headers: getWebRequest()?.headers,
    });
  });
