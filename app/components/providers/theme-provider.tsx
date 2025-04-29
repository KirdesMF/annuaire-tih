import { useRouter } from "@tanstack/react-router";
import { type PropsWithChildren, createContext, use } from "react";
import { setThemeServerFn } from "~/lib/theme";

export type Theme = "light" | "dark" | "system";
type ThemeContextValue = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter();

  function setTheme(value: Theme) {
    setThemeServerFn({ data: value });
    router.invalidate();
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = use(ThemeContext);
  if (!value) throw new Error("useTheme must be used within a ThemeProvider");
  return value;
}
