CREATE TABLE "about_us" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text,
	"created_agent_id" text,
	"status" "status" DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "about_us" ADD CONSTRAINT "about_us_created_agent_id_organization_id_fk" FOREIGN KEY ("created_agent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;