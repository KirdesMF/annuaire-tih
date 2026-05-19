import { readFileSync } from "node:fs";
import { cloudflare, type WorkerConfig } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

type WranglerConfigWithEnvs = WorkerConfig & {
  env?: Record<string, Partial<WorkerConfig>>;
};

const wranglerEnv = process.env.WRANGLER_ENV;
const wranglerConfig = JSON.parse(readFileSync("wrangler.jsonc", "utf8")) as WranglerConfigWithEnvs;

if (!wranglerEnv) {
  throw new Error("WRANGLER_ENV must be set to dev or production");
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    cloudflare({
      configPath: "wrangler.jsonc",
      config: () => {
        const envConfig = wranglerConfig.env?.[wranglerEnv];

        if (!envConfig) {
          throw new Error(`Unknown Wrangler env: ${wranglerEnv}`);
        }

        return envConfig;
      },
      viteEnvironment: { name: "ssr" },
    }),
    tanstackStart({
      srcDirectory: "app",
    }),
    viteReact(),
  ],
});
