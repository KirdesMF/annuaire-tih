import { createFileRoute } from "@tanstack/react-router";
import { sql } from "drizzle-orm";
import { type DbConnectionMode, getDb } from "~/db";

export const Route = createFileRoute("/api/db-health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const startedAt = Date.now();
        const requestedMode = new URL(request.url).searchParams.get("mode");
        const mode: DbConnectionMode =
          requestedMode === "direct" || requestedMode === "hyperdrive" ? requestedMode : "auto";

        try {
          await Promise.race([
            getDb(mode).execute(sql`select 1`),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Database health check timed out")), 5_000),
            ),
          ]);

          return Response.json({ ok: true, mode, durationMs: Date.now() - startedAt });
        } catch (error) {
          console.error("Database health check failed", error);

          return Response.json(
            {
              ok: false,
              mode,
              durationMs: Date.now() - startedAt,
              error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
