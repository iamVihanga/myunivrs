import { adsPaymentPlan } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectAdzPaymentPlanSchema = createSelectSchema(adsPaymentPlan);

export const insertAdzPaymentPlanSchema = createInsertSchema(adsPaymentPlan, {
  planName: (val) => val.min(1).max(100),
  description: (val) => val.max(1000).optional(),
  price: (val) => val.min(0),
  currency: (val) => val.length(3),
  durationDays: (val) => val.int().min(1),
  maxAds: (val) => val.int().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAdzPaymentPlanSchema = createInsertSchema(adsPaymentPlan)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type AdzPaymentPlan = z.infer<typeof selectAdzPaymentPlanSchema>;

export type InsertAdzPaymentPlan = z.infer<typeof insertAdzPaymentPlanSchema>;

export type UpdateAdzPaymentPlan = z.infer<typeof updateAdzPaymentPlanSchema>;
