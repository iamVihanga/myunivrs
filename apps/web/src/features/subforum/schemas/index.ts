import { subforum } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectSubforumSchema = createSelectSchema(subforum);

export const insertSubforumSchema = createInsertSchema(subforum, {
  name: z.string().min(1).max(255),
  description: z.string().optional(),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
});

export const updateSubforumSchema = createInsertSchema(subforum, {
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
})
  .omit({
    id: true,
    createdBy: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type Subforum = z.infer<typeof selectSubforumSchema>;
export type InsertSubforum = z.infer<typeof insertSubforumSchema>;
export type UpdateSubforum = z.infer<typeof updateSubforumSchema>;
