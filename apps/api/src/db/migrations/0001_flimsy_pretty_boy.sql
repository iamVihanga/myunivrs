CREATE TABLE "housing" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"images" text[],
	"created_by" text,
	"agent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "housing" ADD CONSTRAINT "housing_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "housing" ADD CONSTRAINT "housing_agent_id_organization_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;