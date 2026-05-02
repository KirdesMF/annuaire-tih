import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { auth } from "~/lib/auth/auth.server";
import { requireCurrentUser } from "~/lib/auth/permissions.server";

const UpdateUserPasswordSchema = v.object({
  password: v.string(),
  newPassword: v.string(),
});

export const updateUserPasswordFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    return v.parse(UpdateUserPasswordSchema, {
      password: data.get("password"),
      newPassword: data.get("newPassword"),
    });
  })
  .handler(async ({ data }) => {
    const { password, newPassword } = data;
    await requireCurrentUser();

    await auth().api.changePassword({
      body: {
        currentPassword: password,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: getRequest().headers,
    });
  });
