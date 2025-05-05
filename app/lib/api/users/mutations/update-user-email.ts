import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { auth } from "~/lib/auth/auth.server";

const UpdateUserEmailSchema = v.object({
  email: v.string(),
});

export const updateUserEmailFn = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    return v.parse(UpdateUserEmailSchema, {
      email: data.get("email"),
    });
  })
  .handler(async ({ data }) => {
    await auth().api.changeEmail({
      body: { newEmail: data.email },
      headers: getWebRequest()?.headers,
    });
  });
