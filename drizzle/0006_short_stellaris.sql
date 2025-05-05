CREATE TABLE "cgu" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" varchar(255) NOT NULL,
	"content" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_cgu_acceptance" (
	"user_id" text NOT NULL,
	"cgu_id" integer NOT NULL,
	"accepted_at" timestamp NOT NULL,
	CONSTRAINT "user_cgu_acceptance_user_id_cgu_id_pk" PRIMARY KEY("user_id","cgu_id")
);
--> statement-breakpoint
ALTER TABLE "user_cgu_acceptance" ADD CONSTRAINT "user_cgu_acceptance_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cgu_acceptance" ADD CONSTRAINT "user_cgu_acceptance_cgu_id_cgu_id_fk" FOREIGN KEY ("cgu_id") REFERENCES "public"."cgu"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint