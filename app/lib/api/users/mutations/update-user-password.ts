import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { auth } from "~/lib/auth/auth.server";

const UpdateUserPasswordSchema = v.object({
  password: v.string(),
  newPassword: v.string(),
});

export const updateUserPasswordFn = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    return v.parse(UpdateUserPasswordSchema, {
      password: data.get("password"),
      newPassword: data.get("newPassword"),
    });
  })
  .handler(async ({ data }) => {
    const { password, newPassword } = data;

    await auth.api.changePassword({
      body: {
        currentPassword: password,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: getWebRequest()?.headers,
    });
  });
