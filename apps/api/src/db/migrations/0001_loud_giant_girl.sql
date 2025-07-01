CREATE TABLE "ads_payment_plan" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"duration_days" integer NOT NULL,
	"features" jsonb DEFAULT '{}'::jsonb,
	"max_ads" integer DEFAULT 1 NOT NULL,
	"status" "status" DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_name" text NOT NULL,
	"site_description" text,
	"logo_url" text,
	"favicon_url" text,
	"primary_email" text,
	"maintenance_mode" boolean DEFAULT false,
	"meta_tags" jsonb DEFAULT '{}'::jsonb,
	"status" "status" DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
