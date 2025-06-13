import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { sellSwaps } from "@repo/database";

export const selectSellSwapSchema = createSelectSchema(sellSwaps);

export const insertSellSwapSchema = createInsertSchema(sellSwaps, {
  title: (val) => val.min(1).max(500),
  type: z.enum(["sell", "swap"]).default("sell")
}).omit({
  id: true,
  createdAt: true,
  userId: true,
  updatedAt: true
});

export const updateSellSwapSchema = createInsertSchema(sellSwaps)
  .omit({
    id: true,
    createdAt: true,
    userId: true,
    updatedAt: true
  })
  .partial();

// Type Definitions
export type SellSwap = z.infer<typeof selectSellSwapSchema>;

export type InsertSellSwap = z.infer<typeof insertSellSwapSchema>;

export type UpdateSellSwap = z.infer<typeof updateSellSwapSchema>;
