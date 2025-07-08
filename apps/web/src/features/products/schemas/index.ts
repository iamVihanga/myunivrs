import { products } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema
export const selectProductSchema = createSelectSchema(products);

// Insert schema (for creating new products)
export const insertProductSchema = createInsertSchema(products, {
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(9999, "Description must be 9999 characters or less"),
  images: z
    .array(z.string().url("Image must be a valid URL"))
    .optional()
    .default([]),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  discountPercentage: z
    .string()
    .regex(/^\d+$/, "Discount percentage must be a valid number")
    .optional()
    .default("0"),
  location: z.string(),
  condition: z
    .enum(["new", "used", "refurbished", "for_parts"])
    .default("used"),
  stockQuantity: z
    .string()
    .regex(/^\d+$/, "Stock quantity must be a valid number")
    .default("1"),
  isNegotiable: z.boolean().optional().default(false),
  categoryId: z.string().optional(),
  brand: z.string().max(100, "Brand must be 100 characters or less").optional(),
  link: z.string().optional(),
  shipping: z.string().optional(),
  status: z
    .enum(["published", "draft", "deleted"])
    .optional()
    .default("published"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  agentProfile: true,
});

// Update schema (for updating existing products)
export const updateProductSchema = createInsertSchema(products, {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string().url("Must be a valid URL")).optional().default([]),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  discountPercentage: z
    .string()
    .regex(/^\d+$/, "Must be a valid number")
    .optional(),
  location: z.string().min(1, "Location is required"),
  condition: z
    .enum(["new", "used", "refurbished", "for_parts"])
    .default("used"),
  stockQuantity: z
    .string()
    .regex(/^\d+$/, "Must be a valid number")
    .default("1"),
  isNegotiable: z.boolean().optional().default(false),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["published", "draft", "deleted"]).default("published"),
})
  .partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    agentProfile: true,
  });

// Type Definitions
export type Product = z.infer<typeof selectProductSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type UpdateProduct = z.infer<typeof updateProductSchema>;
