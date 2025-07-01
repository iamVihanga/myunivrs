CREATE TABLE "ads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"post_type" text NOT NULL,
	"images" text[] DEFAULT '{}',
	"description" text,
	"contact_information" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"company_name" text,
	"occurrence" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_created_by_organization_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;