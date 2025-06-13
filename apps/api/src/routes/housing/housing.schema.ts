import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { housing } from "@repo/database";
import { z } from "zod";

export const selectHousingSchema = createSelectSchema(housing);

export const insertHousingSchema = createInsertSchema(housing, {
  title: (val) => val.min(1).max(500)
}).omit({
  createdBy: true,
  agentProfile: true,
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateHousingSchema = createInsertSchema(housing)
  .omit({
    id: true,
    createdAt: true
  })
  .partial();

// Type Definitions
export type Housing = z.infer<typeof selectHousingSchema>;

export type InsertHousing = z.infer<typeof insertHousingSchema>;

export type UpdateHousing = z.infer<typeof updateHousingSchema>;
