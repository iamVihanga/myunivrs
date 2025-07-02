import { siteSettings } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectSiteSettingsSchema = createSelectSchema(siteSettings);

export const insertSiteSettingsSchema = createInsertSchema(siteSettings, {
  siteName: (val) => val.min(1).max(100),
  siteDescription: (val) => val.max(1000).optional(),
  logoUrl: (val) => val.url().optional(),
  faviconUrl: (val) => val.url().optional(),
  primaryEmail: (val) => val.email().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSiteSettingsSchema = createInsertSchema(siteSettings)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type SiteSettings = z.infer<typeof selectSiteSettingsSchema>;

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;

export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;
