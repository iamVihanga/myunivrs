import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const university = pgTable("university", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),
  location: text("location"),
  website: text("website"),
  isPublic: boolean("is_public").default(true),

  // You can add createdBy or other foreign keys if needed
  // createdBy: text("created_by").references(() => user.id, { onDelete: "cascade" }),

  ...timestamps,
});
