import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const institute = pgTable("institute", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(), // Institute name

  description: text("description"), // Optional description

  address: text("address").notNull(), // Institute address

  contactEmail: text("contact_email"), // Optional contact email

  contactPhone: text("contact_phone"), // Optional contact phone

  website: text("website"), // Optional website link

  logoUrl: text("logo_url"), // Optional logo/image URL

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),

  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),

  status: statusEnum().default("published"),

  ...timestamps,
});
