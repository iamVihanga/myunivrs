import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { products } from "@repo/database";

export const selectProductSchema = createSelectSchema(products);

export const insertProductSchema = createInsertSchema(products, {
  title: (val) => val.min(1).max(500),
  price: (val) => val.min(0),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  agentProfile: true,
  updatedAt: true,
});

export const updateProductSchema = createInsertSchema(products)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Product = z.infer<typeof selectProductSchema>;

export type InsertProduct = z.infer<typeof insertProductSchema>;

export type UpdateProduct = z.infer<typeof updateProductSchema>;
