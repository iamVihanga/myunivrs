import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  title: text("title").notNull(),
  message: text("message").notNull(),

  read: boolean("read").default(false),

  ...timestamps,
});
