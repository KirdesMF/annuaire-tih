import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import * as v from "valibot";
import { auth } from "~/lib/auth/auth.server";

const UserInfosSchema = v.object({
  name: v.optional(v.string()),
});

export const updateUserInfos = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    return v.parse(UserInfosSchema, {
      name: data.get("name"),
      image: data.get("image"),
    });
  })
  .handler(async ({ data }) => {
    const request = getRequest();

    await auth().api.updateUser({ headers: request.headers, body: { ...data } });
  });
