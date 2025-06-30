import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const adz = pgTable("adz", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array(),
  address: text("address").notNull(),
  price: text("price").notNull(),
  link: text("link"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  agentProfile: text("agent_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  status: statusEnum().default("published"),

  ...timestamps,
});
