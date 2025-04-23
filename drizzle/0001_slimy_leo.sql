ALTER TABLE "companies" ALTER COLUMN "gallery" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "gallery" SET NOT NULL;