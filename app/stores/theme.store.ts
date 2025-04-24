import { create } from "zustand";

type ThemeStore = {
  theme: string | null;
  onThemeLight: () => void;
  onThemeDark: () => void;
  onThemeSystem: () => void;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: null,

  onThemeLight: () => {
    localStorage.setItem("theme", "light");
    document.documentElement.dataset.theme = "light";
    set({ theme: "light" });
  },

  onThemeDark: () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.dataset.theme = "dark";
    set({ theme: "dark" });
  },

  onThemeSystem: () => {
    localStorage.removeItem("theme");
    document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    set({ theme: "system" });
  },

  setTheme: (theme) => set({ theme }),
}));

function getTheme() {
  return (typeof window !== "undefined" && localStorage.getItem("theme")) || "system";
}
