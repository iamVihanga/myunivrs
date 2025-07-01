import { ads } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema (for fetching ads from DB)
export const selectAdsSchema = createSelectSchema(ads);

// Insert schema (for creating new ads)
export const insertAdsSchema = createInsertSchema(ads, {
  title: z.string().min(1).max(500),
  postType: z.string().min(1), // could be an enum like "sale" | "rent" | etc.
  images: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  contactInformation: z.string().optional(),
  isFeatured: z.boolean().optional(),
  companyName: z.string().optional(),
  occurrence: z.string().optional(), // could also be enum: "daily", "weekly", etc.
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (for editing existing ads)
export const updateAdsSchema = createInsertSchema(ads, {
  title: z.string().min(1).max(500).optional(),
  postType: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  contactInformation: z.string().optional(),
  isFeatured: z.boolean().optional(),
  companyName: z.string().optional(),
  occurrence: z.string().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
  })
  .partial();

// Type definitions
export type Ads = z.infer<typeof selectAdsSchema>;
export type InsertAds = z.infer<typeof insertAdsSchema>;
export type UpdateAds = z.infer<typeof updateAdsSchema>;
