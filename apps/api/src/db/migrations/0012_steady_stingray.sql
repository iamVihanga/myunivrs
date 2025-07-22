CREATE TABLE "b2b_profiles" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"images" text[] DEFAULT '{}',
	"username" text NOT NULL,
	"business_name" text,
	"business_type" text,
	"contact_person" text,
	"phone_number" text,
	"address" text,
	"subscription_plan" text,
	"plan_expiry_date" timestamp,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "b2b_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "b2b_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "b2b_profiles" ADD CONSTRAINT "b2b_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;