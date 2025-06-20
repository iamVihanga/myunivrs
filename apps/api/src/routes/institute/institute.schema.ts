import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { institute } from "@repo/database";

// Full select schema
export const selectInstituteSchema = createSelectSchema(institute);

// Insert schema with validations
export const insertInstituteSchema = createInsertSchema(institute, {
  name: (val) => val.min(1).max(200),
  address: (val) => val.min(1).max(300),
  contactEmail: (val) => val.email().optional(),
  contactPhone: (val) => val.min(7).max(15).optional(),
  website: (val) => val.url().optional(),
  logoUrl: (val) => val.url().optional(),
}).omit({
  id: true,
  createdBy: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema
export const updateInstituteSchema = createInsertSchema(institute)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    organizationId: true,
  })
  .partial();

// Type Definitions
export type Institute = z.infer<typeof selectInstituteSchema>;
export type InsertInstitute = z.infer<typeof insertInstituteSchema>;
export type UpdateInstitute = z.infer<typeof updateInstituteSchema>;
