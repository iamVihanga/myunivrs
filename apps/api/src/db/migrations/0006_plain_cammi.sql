CREATE TABLE "movie" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"name" text NOT NULL,
	"location" text,
	"prize" numeric,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
