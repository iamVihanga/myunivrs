ALTER TABLE "posts" DROP CONSTRAINT "posts_url_unique";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "url" DROP NOT NULL;