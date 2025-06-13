import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { productCategories } from "@repo/database";

export const selectProductCategorySchema =
  createSelectSchema(productCategories);

export const insertProductCategorySchema = createInsertSchema(
  productCategories,
  {
    name: (val) => val.min(1).max(255)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateProductCategorySchema = createInsertSchema(productCategories)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

// Type Definitions
export type ProductCategory = z.infer<typeof selectProductCategorySchema>;

export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;

export type UpdateProductCategory = z.infer<typeof updateProductCategorySchema>;
