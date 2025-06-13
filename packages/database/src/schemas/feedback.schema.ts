import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const feedback = pgTable("feedback", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  rating: integer("rating"),
  status: statusEnum().default("published"),

  targetAgentId: text("targetted_agent_id").references(() => organization.id, {
    onDelete: "cascade"
  }),

  ...timestamps
});
