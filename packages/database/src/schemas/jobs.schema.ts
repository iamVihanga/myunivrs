import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const jobs = pgTable("jobs", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array(),
  isFeatured: boolean("is_featured").default(false),
  company: text("company").notNull(),

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade"
  }),
  agentProfile: text("agent_id").references(() => organization.id, {
    onDelete: "cascade"
  }),
  status: statusEnum().default("published"),

  ...timestamps
});
