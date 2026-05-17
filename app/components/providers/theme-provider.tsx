import {
  createContext,
  type PropsWithChildren,
  use,
  useEffect,
  useState,
} from "react";
import {
  resolveTheme,
  THEME_COOKIE_NAME,
  type Theme,
} from "~/lib/theme.shared";

export type { Theme } from "~/lib/theme.shared";

type ThemeContextValue = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

const COOKIE_ATTRS = {
  name: THEME_COOKIE_NAME,
  path: "/",
  maxAge: 365 * 24 * 60 * 60,
  sameSite: "lax" as const,
};

function getPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function updateDocumentTheme(theme: Theme): void {
  document.documentElement.dataset.theme = resolveTheme(
    theme,
    getPrefersDark(),
  );
}

async function writeCookie(value: Theme): Promise<void> {
  if (typeof cookieStore === "undefined") return;

  try {
    await cookieStore.set({ ...COOKIE_ATTRS, value });
  } catch {
    return;
  }
}

export function ThemeProvider({ children, theme: initialTheme }: Props) {
  const [theme, setThemeState] = useState(initialTheme);

  useEffect(() => {
    updateDocumentTheme(theme);

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => updateDocumentTheme("system");

    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  async function setTheme(value: Theme): Promise<void> {
    await writeCookie(value);
    setThemeState(value);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = use(ThemeContext);
  if (!value) throw new Error("useTheme must be used within a ThemeProvider");
  return value;
}
