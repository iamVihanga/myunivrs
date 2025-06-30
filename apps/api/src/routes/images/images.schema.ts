
import { images } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// You can add more validation as needed for each field
export const selectImagesSchema = createSelectSchema(images);

export const insertImagesSchema = createInsertSchema(images, {
  id: z.string().min(1).max(500),
  url: z.string().optional(),

}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateImagesSchema = createInsertSchema(images, {
  id: z.string().min(1).max(500).optional(),
  url: z.string().optional(),

})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Images = z.infer<typeof selectImagesSchema>;
export type InsertImages = z.infer<typeof insertImagesSchema>;
export type UpdateImages = z.infer<typeof updateImagesSchema>;
