import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";

export const b2bProfile = pgTable("b2b_profiles", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .unique(), // One profile per user
  images: text("images").array().default([]),
  username: text("username").notNull().unique(),

  // Business attributes
  businessName: text("business_name"),
  businessType: text("business_type"), // e.g., "Restaurant", "Retail", "Service", etc.
  contactPerson: text("contact_person"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  subscriptionPlan: text("subscription_plan"), // e.g., "Basic", "Premium", "Enterprise"
  planExpiryDate: timestamp("plan_expiry_date", { mode: "date" }),
  verified: boolean("verified").default(false),

  ...timestamps,
});
