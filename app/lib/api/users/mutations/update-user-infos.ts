import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import * as v from "valibot";

const UserInfosSchema = v.object({
  name: v.optional(v.string()),
});

export const updateUserInfos = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    return v.parse(UserInfosSchema, {
      name: data.get("name"),
      image: data.get("image"),
    });
  })
  .handler(async ({ data }) => {
    const request = getWebRequest();

    if (!request) throw new Error("Request not found");

    await auth.api.updateUser({ headers: request.headers, body: { ...data } });
  });
