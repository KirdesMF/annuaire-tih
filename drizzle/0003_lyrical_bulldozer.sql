ALTER TABLE "companies" DROP CONSTRAINT "companies_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "rqth" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "rqth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;