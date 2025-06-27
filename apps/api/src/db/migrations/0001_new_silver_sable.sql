ALTER TABLE "housing" DROP CONSTRAINT "housing_agent_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "images" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "images" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "price" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "housing" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "housing" ADD CONSTRAINT "housing_agent_id_organization_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "bedrooms";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "bathrooms";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "parking";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "contact_number";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "housing_type";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "square_footage";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "year_built";--> statement-breakpoint
ALTER TABLE "housing" DROP COLUMN "is_furnished";