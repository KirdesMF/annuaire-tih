CREATE TABLE "analytics_events" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"path" varchar(255) NOT NULL,
	"company_slug" varchar(100),
	"category_slug" varchar(100),
	"source" varchar(100),
	"visitor_id" varchar(64),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
