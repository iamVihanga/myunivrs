import { university } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUniversitySchema = createSelectSchema(university);

export const insertUniversitySchema = createInsertSchema(university, {
  name: (val) => val.min(1).max(30),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUniversitySchema = createInsertSchema(university)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type university = z.infer<typeof selectUniversitySchema>;

export type InsertUniversity = z.infer<typeof insertUniversitySchema>;

export type UpdateUniversity = z.infer<typeof updateUniversitySchema>;
