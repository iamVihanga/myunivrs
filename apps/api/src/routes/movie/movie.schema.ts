import { movie } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select Schema
export const selectMovieSchema = createSelectSchema(movie);

// Insert Schema
export const insertMovieSchema = createInsertSchema(movie, {
  name: (val) => val.min(1).max(255),
  description: (val) => val.max(1000).optional(),
  location: (val) => val.max(255).optional(),
  prize: (val) =>
    val.refine((val) => !isNaN(Number(val)), {
      message: "Prize must be a number",
    }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update Schema
export const updateMovieSchema = createInsertSchema(movie)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type Movie = z.infer<typeof selectMovieSchema>;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type UpdateMovie = z.infer<typeof updateMovieSchema>;
