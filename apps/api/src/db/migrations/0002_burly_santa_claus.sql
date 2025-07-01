CREATE TYPE "public"."condition" AS ENUM('new', 'used', 'refurbished', 'damaged');--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'active';--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'sold';--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'swapped';--> statement-breakpoint
ALTER TYPE "public"."status" ADD VALUE 'expired';--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "condition" "condition" DEFAULT 'used' NOT NULL;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "zip_code" text;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "status" "status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "swap_preferences" text;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "contact_number" text;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "sell_swaps" ADD COLUMN "tags" text[] DEFAULT '{}'::text[] NOT NULL;