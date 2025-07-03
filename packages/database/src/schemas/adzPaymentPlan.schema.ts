import { sql } from "drizzle-orm";
import { integer, jsonb, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { statusEnum } from "./shared.schema";

export const adsPaymentPlan = pgTable("ads_payment_plan", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  planName: text("plan_name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  durationDays: integer("duration_days").notNull(),
  features: jsonb("features").default({}),
  maxAds: integer("max_ads").notNull().default(1),
  status: statusEnum().default("published"),
  ...timestamps,
});
