import { adsPaymentPlan } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectAdsPaymentPlanSchema = createSelectSchema(adsPaymentPlan);

export const insertAdsPaymentPlanSchema = createInsertSchema(adsPaymentPlan, {
  planName: (val) => val.min(1).max(100),
  description: (val) => val.max(1000).optional(),
  price: (val) => val.min(0),
  currency: (val) => val.length(3),
  durationDays: (val) => val.int().min(1),
  maxAds: (val) => val.int().min(1),
  // features: (val) => val.optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAdsPaymentPlanSchema = createInsertSchema(adsPaymentPlan)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type AdsPaymentPlan = z.infer<typeof selectAdsPaymentPlanSchema>;

export type InsertAdsPaymentPlan = z.infer<typeof insertAdsPaymentPlanSchema>;

export type UpdateAdsPaymentPlan = z.infer<typeof updateAdsPaymentPlanSchema>;
