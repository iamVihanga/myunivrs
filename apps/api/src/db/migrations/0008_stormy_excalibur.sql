CREATE TYPE "public"."condition" AS ENUM('new', 'used', 'refurbished', 'for_parts');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "condition" "condition" DEFAULT 'used' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stock_quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_negotiable" boolean DEFAULT false;