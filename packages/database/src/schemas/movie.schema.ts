import { sql } from "drizzle-orm";
import { boolean, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const movie = pgTable("movie", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  description: text("description"),
  name: text("name").notNull(),
  location: text("location"),
  prize: numeric("prize"),
  isPublic: boolean("is_public").default(true),

  // You can add createdBy or other foreign keys if needed
  // createdBy: text("created_by").references(() => user.id, { onDelete: "cascade" }),

  ...timestamps,
});
