// talent.zod.ts

import { talent } from "@repo/database"; // your talent table schema
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectTalentSchema = createSelectSchema(talent);

export const insertTalentSchema = createInsertSchema(talent, {
  name: (val) => val.min(1).max(100),
  role: (val) =>
    val.refine(
      (value) =>
        [
          "model",
          "photographer",
          "fashion_designer",
          "makeup_artist",
          "stylist",
          "agency",
          "videographer",
          "hair_stylist",
          "event_organizer",
          "retoucher",
          "casting_director",
          "client",
        ].includes(value),
      { message: "Invalid role" }
    ),
  location: (val) => val.max(100).optional(),
  bio: (val) => val.max(1000).optional(),
  experienceYears: (val) => val.min(0).max(100).optional(),
  hourlyRate: (val) => val.min(0).optional(),
  portfolioUrls: (val) => val.optional(),
  socialLinks: (val) => val.optional(),
}).omit({
  id: true,
  createdBy: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTalentSchema = createInsertSchema(talent)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Types
export type Talent = z.infer<typeof selectTalentSchema>;
export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type UpdateTalent = z.infer<typeof updateTalentSchema>;
