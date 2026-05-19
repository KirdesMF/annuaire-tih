import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { auth } from "~/lib/auth/auth.server";
import { requireCurrentUser } from "~/lib/auth/permissions.server";

const UpdateUserEmailSchema = v.object({
  email: v.string(),
});

export const updateUserEmailFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    return v.parse(UpdateUserEmailSchema, {
      email: data.get("email"),
    });
  })
  .handler(async ({ data }) => {
    await requireCurrentUser();

    await auth().api.changeEmail({
      body: { newEmail: data.email },
      headers: getRequest().headers,
    });
  });
