// import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// import { housing } from "@repo/database";
// import { z } from "zod";

// export const selectHousingSchema = createSelectSchema(housing);

// export const insertHousingSchema = createInsertSchema(housing, {
//   title: (val) => val.min(1).max(500)
// }).omit({
//   createdBy: true,
//   agentProfile: true,
//   id: true,
//   createdAt: true,
//   updatedAt: true
// });

// export const updateHousingSchema = createInsertSchema(housing)
//   .omit({
//     id: true,
//     createdAt: true
//   })
//   .partial();

// // Type Definitions
// export type Housing = z.infer<typeof selectHousingSchema>;

// export type InsertHousing = z.infer<typeof insertHousingSchema>;

// export type UpdateHousing = z.infer<typeof updateHousingSchema>;

import { housing } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// You can add more validation as needed for each field
export const selectHousingSchema = createSelectSchema(housing);

export const insertHousingSchema = createInsertSchema(housing, {
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  address: z.string().min(1).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  price: z.string().min(1).optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  parking: z.string().optional(),
  contactNumber: z.string().optional(),
  housingType: z.string().optional(),
  squareFootage: z.string().nullable().optional(),
  yearBuilt: z.string().nullable().optional(),
  isFurnished: z.boolean().optional(),
  link: z.string().nullable().optional(),
  status: z.string().optional(),
}).omit({
  createdBy: true,
  agentProfile: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateHousingSchema = createInsertSchema(housing, {
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  parking: z.string().optional(),
  contactNumber: z.string().optional(),
  housingType: z.string().optional(),
  squareFootage: z.string().nullable().optional(),
  yearBuilt: z.string().nullable().optional(),
  isFurnished: z.boolean().optional(),
  link: z.string().url().nullable().optional(),
  status: z.string().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    agentProfile: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Housing = z.infer<typeof selectHousingSchema>;
export type InsertHousing = z.infer<typeof insertHousingSchema>;
export type UpdateHousing = z.infer<typeof updateHousingSchema>;
