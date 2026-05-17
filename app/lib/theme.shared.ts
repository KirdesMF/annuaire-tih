export const THEME_COOKIE_NAME = "ui-theme";
export const DEFAULT_THEME = "system";
export const THEME_VALUES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEME_VALUES)[number];
export type ResolvedTheme = Exclude<Theme, "system">;

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEME_VALUES.includes(value as Theme);
}

export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}
