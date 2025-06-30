CREATE TYPE "public"."job_type" AS ENUM('full_time', 'part_time', 'contract', 'internship', 'temporary');--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "required_skills" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "salary_range" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "action_url" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "job_type" "job_type" DEFAULT 'full_time' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "cv_required" boolean DEFAULT false;