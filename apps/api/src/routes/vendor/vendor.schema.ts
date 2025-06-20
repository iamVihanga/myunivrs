import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { vendor } from "@repo/database"; // Ensure this path points to your vendor schema in database

export const selectVendorSchema = createSelectSchema(vendor);

export const insertVendorSchema = createInsertSchema(vendor, {
  name: (val) => val.min(1).max(255),
  serviceType: (val) => val.min(1).max(100),
  contactEmail: (val) => val.email().max(255),
  phoneNumber: (val) => val.min(7).max(20),
  address: (val) => val.min(1).max(300),
  website: (val) => val.url().optional(),
  description: (val) => val.max(1000).optional(),
}).omit({
  createdBy: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateVendorSchema = createInsertSchema(vendor)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type Vendor = z.infer<typeof selectVendorSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type UpdateVendor = z.infer<typeof updateVendorSchema>;
