ALTER TABLE "companies" ALTER COLUMN "logo" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "logo" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "gallery" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "gallery" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "social_media" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "social_media" DROP NOT NULL;