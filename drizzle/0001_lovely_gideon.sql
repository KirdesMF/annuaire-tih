ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "siret" varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "logo" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "rqth" boolean;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "social_media" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;