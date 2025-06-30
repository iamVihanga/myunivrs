import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { adz } from "@repo/database";
import { z } from "zod";

export const selectAdzSchema = createSelectSchema(adz);

export const insertAdzSchema = createInsertSchema(adz, {
  title: (val) => val.min(1).max(500),
}).omit({
  createdBy: true,
  agentProfile: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAdzSchema = createInsertSchema(adz)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type Adz = z.infer<typeof selectAdzSchema>;

export type InsertAdz = z.infer<typeof insertAdzSchema>;

export type UpdateAdz = z.infer<typeof updateAdzSchema>;
