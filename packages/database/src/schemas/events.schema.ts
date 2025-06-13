import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array(),
  location: text("location").notNull(),
  isFeatured: boolean("is_featured").default(false),
  eventDate: timestamp("event_date").notNull(),

  createdBy: text("created_agent_id").references(() => organization.id, {
    onDelete: "cascade"
  }),
  status: statusEnum().default("published"),

  ...timestamps
});
