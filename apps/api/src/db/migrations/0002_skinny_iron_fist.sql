CREATE TABLE "b2bplans" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"images" text[] DEFAULT '{}',
	"description" text,
	"price" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "b2bplans" ADD CONSTRAINT "b2bplans_created_by_organization_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;