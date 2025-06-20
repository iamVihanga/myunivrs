CREATE TABLE "sales" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"payment_method" text NOT NULL,
	"transaction_date" timestamp DEFAULT now(),
	"customer_name" text NOT NULL,
	"sales_agent_id" text,
	"branch_id" text,
	"status" "status" DEFAULT 'published',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_sales_agent_id_user_id_fk" FOREIGN KEY ("sales_agent_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_branch_id_organization_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;