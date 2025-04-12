ALTER TABLE "companies" ALTER COLUMN "logo" SET DATA TYPE jsonb USING CASE 
  WHEN logo IS NULL THEN '{"secureUrl":"","publicId":""}'::jsonb 
  ELSE json_build_object('secureUrl', logo, 'publicId', '')::jsonb 
END;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "logo" SET DEFAULT '{"secureUrl":"","publicId":""}'::jsonb;--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "logo" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "gallery" jsonb DEFAULT '[{"secureUrl":"","publicId":""},{"secureUrl":"","publicId":""}]'::jsonb NOT NULL;