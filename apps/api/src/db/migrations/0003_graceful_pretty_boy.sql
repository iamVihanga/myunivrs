CREATE TABLE "university" (
	"id" text,
	"name" text NOT NULL,
	"countryCode" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
