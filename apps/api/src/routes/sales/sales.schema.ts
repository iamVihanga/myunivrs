import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { sales } from "@repo/database"; // adjust path if needed

export const selectSalesSchema = createSelectSchema(sales);

export const insertSalesSchema = createInsertSchema(sales, {
  productName: (val) => val.min(1).max(255),
  paymentMethod: (val) => val.min(1).max(50),
  customerName: (val) => val.min(1).max(255),
  quantity: z.number().min(1),
  totalPrice: z.number().min(0),
  transactionDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
}).omit({
  id: true,
  salesAgentId: true,
  branchId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSalesSchema = createInsertSchema(sales)
  .omit({
    id: true,
    salesAgentId: true,
    branchId: true,
    createdAt: true,
  })
  .extend({
    transactionDate: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
  })
  .partial();

// Type Definitions
export type Sales = z.infer<typeof selectSalesSchema>;

export type InsertSales = z.infer<typeof insertSalesSchema>;

export type UpdateSales = z.infer<typeof updateSalesSchema>;
