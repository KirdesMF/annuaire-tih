// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "unenv";

export default defineConfig({
	vite: {
		plugins: [
			tailwindcss(),
			tsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
		],
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
						return;
					}
					warn(warning);
				},
			},
		},
	},
	server: {
		preset: "cloudflare-pages",
		unenv: cloudflare,
	},
});
