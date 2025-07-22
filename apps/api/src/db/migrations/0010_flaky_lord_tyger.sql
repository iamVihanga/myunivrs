ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_email_unique";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "phone_number";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "gender";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "university";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN "date_of_birth";