import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const wranglerConfigPath = process.env.WRANGLER_CONFIG ?? "wrangler.jsonc";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    cloudflare({ configPath: wranglerConfigPath, viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      srcDirectory: "app",
    }),
    viteReact(),
  ],
});
