import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const images = pgTable("images", {
  id: text("id").primaryKey().notNull(),
  url: text("url").notNull(),
  // Optionally, reference to the parent entity (e.g., housingId)
  housingId: text("housing_id").notNull(),
  ...timestamps,
});
