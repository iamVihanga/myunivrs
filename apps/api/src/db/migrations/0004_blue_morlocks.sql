ALTER TABLE "university" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "university" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "university" ALTER COLUMN "id" SET NOT NULL;