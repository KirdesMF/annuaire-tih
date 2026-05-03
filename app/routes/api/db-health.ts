import { createFileRoute } from "@tanstack/react-router";
import { sql } from "drizzle-orm";
import { getDb } from "~/db";

export const Route = createFileRoute("/api/db-health")({
  server: {
    handlers: {
      GET: async () => {
        const startedAt = Date.now();

        try {
          await Promise.race([
            getDb().execute(sql`select 1`),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Database health check timed out")), 5_000),
            ),
          ]);

          return Response.json({ ok: true, durationMs: Date.now() - startedAt });
        } catch (error) {
          console.error("Database health check failed", error);

          return Response.json(
            {
              ok: false,
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
