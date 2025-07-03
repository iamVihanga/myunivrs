import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization } from "./auth.schema";

export const b2bplans = pgTable("b2bplans", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: text("title").notNull(),
  images: text("images").array().default([]),
  description: text("description"),
  prize: text("price").notNull(),
  type: text("type").notNull(), // e.g., "basic", "premium", "enterprise"

  createdBy: text("created_by").references(() => organization.id, {
    onDelete: "cascade",
  }),

  ...timestamps,
});
