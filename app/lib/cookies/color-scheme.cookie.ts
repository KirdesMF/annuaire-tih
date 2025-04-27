import { getCookie, setCookie } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { queryOptions } from "@tanstack/react-query";

const SCHEME = ["dark", "light", "system"] as const;
const ColorSchemeSchema = v.picklist(SCHEME);

export const setColorSchemeFn = createServerFn({ method: "POST" })
  .validator(ColorSchemeSchema)
  .handler(({ data }) => {
    setCookie("color-scheme", data, {
      path: "/",
      sameSite: "lax",
      secure: true,
      httpOnly: true,
    });
  });

const getColorSchemeFn = createServerFn({ method: "GET" })
  .validator(() => {
    const cookie = getCookie("color-scheme") ?? "system";
    const scheme = v.parse(ColorSchemeSchema, cookie);
    return scheme;
  })
  .handler(({ data }) => {
    return data;
  });

export const colorSchemeQuery = queryOptions({
  queryKey: ["color-scheme"],
  queryFn: () => getColorSchemeFn(),
});
