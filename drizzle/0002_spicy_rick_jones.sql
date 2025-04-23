ALTER TABLE "companies" ALTER COLUMN "logo" SET DEFAULT '{"publicId":"","secureUrl":""}'::jsonb;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "logo" SET NOT NULL;