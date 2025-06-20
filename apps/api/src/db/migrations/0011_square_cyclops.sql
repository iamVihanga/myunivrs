CREATE TABLE "vendor" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"service_type" text NOT NULL,
	"description" text,
	"contact_email" varchar(255),
	"phone_number" varchar(20),
	"address" text,
	"website" text,
	"created_by" text,
	"status" "status" DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;