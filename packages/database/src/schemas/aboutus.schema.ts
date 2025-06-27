import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const aboutus = pgTable("about_us", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  content: text("content"),
  createdBy: text("created_agent_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  status: statusEnum().default("published"),

  ...timestamps,
});
