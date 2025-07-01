import { b2bplans } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema (for fetching plans from DB)
export const selectB2BPlanSchema = createSelectSchema(b2bplans);

// Insert schema (for creating new plans)
export const insertB2BPlanSchema = createInsertSchema(b2bplans, {
  title: z.string().min(1).max(500),
  images: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  prize: z.string().min(1),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (for editing existing plans)
export const updateB2BPlanSchema = createInsertSchema(b2bplans, {
  title: z.string().min(1).max(500).optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  prize: z.string().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
  })
  .partial();

// Type definitions
export type B2BPlan = z.infer<typeof selectB2BPlanSchema>;
export type InsertB2BPlan = z.infer<typeof insertB2BPlanSchema>;
export type UpdateB2BPlan = z.infer<typeof updateB2BPlanSchema>;
