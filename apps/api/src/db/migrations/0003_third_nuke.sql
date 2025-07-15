ALTER TABLE "posts" ALTER COLUMN "url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "images" text[];