import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { customer } from "@repo/database"; // Make sure the path is correct

export const selectCustomerSchema = createSelectSchema(customer);

export const insertCustomerSchema = createInsertSchema(customer, {
  name: (val) => val.min(1).max(100),
  address: (val) => val.min(1).max(300),
  gender: (val) => val.min(1).max(10),
  age: z.number().min(0).max(120),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
});

export const updateCustomerSchema = createInsertSchema(customer)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Customer = z.infer<typeof selectCustomerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
