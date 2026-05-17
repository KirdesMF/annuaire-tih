import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { DEFAULT_THEME, isTheme, THEME_COOKIE_NAME } from "~/lib/theme.shared";

export const getThemeServerFn = createServerFn({ method: "GET" }).handler(() => {
  const theme = getCookie(THEME_COOKIE_NAME);

  if (!isTheme(theme)) return DEFAULT_THEME;

  return theme;
});
