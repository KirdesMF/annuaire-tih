DO $$
DECLARE
  active_cgu_id integer;
BEGIN
  SELECT id INTO active_cgu_id
  FROM "cgu"
  WHERE "is_active" = true
  ORDER BY "created_at" DESC
  LIMIT 1;

  IF active_cgu_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user'
      AND column_name = 'cgu'
  ) THEN
    INSERT INTO "user_cgu_acceptance" ("user_id", "cgu_id", "accepted_at")
    SELECT "user"."id", active_cgu_id, now()
    FROM "user"
    WHERE "user"."cgu" = true
      AND NOT EXISTS (
        SELECT 1
        FROM "user_cgu_acceptance"
        WHERE "user_cgu_acceptance"."user_id" = "user"."id"
          AND "user_cgu_acceptance"."cgu_id" = active_cgu_id
      );
  END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "cgu";