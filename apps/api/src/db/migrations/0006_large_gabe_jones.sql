CREATE TABLE "test" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"description" text,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
