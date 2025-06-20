import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const vendor = pgTable("vendor", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),

  serviceType: text("service_type").notNull(), // e.g., catering, decoration, DJ

  description: text("description"),

  contactEmail: varchar("contact_email", { length: 255 }),

  phoneNumber: varchar("phone_number", { length: 20 }),

  address: text("address"),

  website: text("website"),

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),

  status: statusEnum().default("published"),

  ...timestamps,
});
