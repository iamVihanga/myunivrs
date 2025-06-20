import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { bank } from "@repo/database"; // Adjust this import path if needed

export const selectBankSchema = createSelectSchema(bank);

export const insertBankSchema = createInsertSchema(bank, {
  name: (val) => val.min(1).max(100),
  branch: (val) => val.min(1).max(100),
  accountNumber: (val) => val.min(5).max(50),
  accountHolder: (val) => val.min(1).max(100),
  swiftCode: (val) => val.max(20).optional(),
  isActive: z.boolean().optional(),
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
});

export const updateBankSchema = createInsertSchema(bank)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Bank = z.infer<typeof selectBankSchema>;
export type InsertBank = z.infer<typeof insertBankSchema>;
export type UpdateBank = z.infer<typeof updateBankSchema>;
