import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization } from "./auth.schema";

export const ads = pgTable("ads", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: text("title").notNull(),
  postType: text("post_type").notNull(), // e.g., "sale", "rent", etc.
  images: text("images").array().default([]),
  description: text("description"),
  contactInformation: text("contact_information"),
  isFeatured: boolean("is_featured").notNull().default(false),
  companyName: text("company_name"),
  occurrence: text("occurrence"), // e.g., "weekly", "monthly", or one-time

  createdBy: text("created_by").references(() => organization.id, {
    onDelete: "cascade",
  }),

  ...timestamps,
});
