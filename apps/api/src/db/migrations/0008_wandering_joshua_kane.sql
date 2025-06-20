CREATE TABLE "bank" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"branch" text NOT NULL,
	"account_number" text NOT NULL,
	"account_holder" text NOT NULL,
	"swift_code" text,
	"is_active" boolean DEFAULT true,
	"created_by" text,
	"status" "status" DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bank" ADD CONSTRAINT "bank_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;