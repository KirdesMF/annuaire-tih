import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";
import type { Theme } from "~/components/providers/theme-provider";

const COOKIE_NAME = "ui-theme";
const ThemeSchema = v.picklist(["light", "dark", "system"]);

export const getThemeServerFn = createServerFn({ method: "GET" }).handler(() => {
  return (getCookie(COOKIE_NAME) ?? "system") as Theme;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
  .validator(ThemeSchema)
  .handler(({ data }) => {
    setCookie(COOKIE_NAME, data);
  });
