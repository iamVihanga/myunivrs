import { products } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Match the enum from your schema
const conditionEnum = z.enum(["new", "used", "refurbished", "for_parts"]);
const statusEnum = z.enum(["published", "draft", "archived"]); // adjust if your statusEnum differs

export const selectProductSchema = createSelectSchema(products);

export const insertProductSchema = createInsertSchema(products, {
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  price: z.number().min(0),
  discountPercentage: z.number().min(0).max(100).optional().default(0),
  location: z.string().min(1, "Location is required"),
  condition: conditionEnum.default("used"),
  stockQuantity: z.number().min(1).default(1),
  isNegotiable: z.boolean().default(false),
  categoryId: z.string().optional(),
  status: statusEnum.default("published"),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  agentProfile: true,
  updatedAt: true,
});

export const updateProductSchema = createInsertSchema(products, {
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  price: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  location: z.string().optional(),
  condition: conditionEnum.optional(),
  stockQuantity: z.number().min(1).optional(),
  isNegotiable: z.boolean().optional(),
  categoryId: z.string().optional(),
  status: statusEnum.optional(),
})
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    agentProfile: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Product = z.infer<typeof selectProductSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
