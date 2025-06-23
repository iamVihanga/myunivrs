CREATE TABLE "talent" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"role" text NOT NULL,
	"location" varchar(100),
	"bio" text,
	"experience_years" integer,
	"hourly_rate" integer,
	"portfolio_urls" json,
	"social_links" json,
	"created_by" text,
	"organization_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "talent" ADD CONSTRAINT "talent_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent" ADD CONSTRAINT "talent_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;