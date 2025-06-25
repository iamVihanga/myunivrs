import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { productCategories } from "./products.schema";

export const sellSwapTypes = pgEnum("sell_swap_types", ["sell", "swap"]);

export const sellSwaps = pgTable("sell_swaps", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default([]),

  categoryId: text("category_id").references(() => productCategories.id),
  type: sellSwapTypes(),

  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),

  ...timestamps,
});
