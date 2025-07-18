// drizzle schema - connections.schema.ts

import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema"; // assuming you have a `users` table

export const connections = pgTable("connections", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  senderId: text("sender_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  receiverId: text("receiver_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  status: text("status")
    .$type<"pending" | "accepted" | "rejected">()
    .default("pending"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
