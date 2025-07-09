import { sql } from "drizzle-orm";
import { integer, numeric, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";

import { conditionEnum, statusEnum } from "./shared.schema";

export const sellSwapTypes = pgEnum("sell_swap_types", ["sell", "swap"]);

export const sellSwaps = pgTable("sell_swaps", {
  // Primary key with UUID (unchanged)
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default([]),
  type: sellSwapTypes("type"),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),

  price: numeric("price", { precision: 10, scale: 2 }),

  condition: conditionEnum("condition").notNull().default("used"),

  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),

  status: statusEnum("status").notNull().default("draft"),

  swapPreferences: text("swap_preferences"),

  contactNumber: text("contact_number"),

  quantity: integer("quantity").notNull().default(1),

  tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),

  ...timestamps,
});
