ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_comment_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "parent_comment_id";