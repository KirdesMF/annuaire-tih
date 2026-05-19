import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

const COOKIE_NAME = "app-theme";

const THEME_VALUES = ["light", "dark", "auto"] as const;
const ThemeSchema = v.picklist(THEME_VALUES);
export type Theme = v.InferOutput<typeof ThemeSchema>;
const DEFAULT_THEME = "auto" satisfies Theme;

const FallbackThemeSchema = v.fallback(ThemeSchema, DEFAULT_THEME);

function getThemeFromCookie(): Theme {
  return v.parse(FallbackThemeSchema, getCookie(COOKIE_NAME));
}

export const getThemeServerFn = createServerFn().handler(() => getThemeFromCookie());

export const setThemeServerFn = createServerFn()
  .inputValidator(ThemeSchema)
  .handler(({ data }) => setCookie(COOKIE_NAME, data));
