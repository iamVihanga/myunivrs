import { comment } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectCommentSchema = createSelectSchema(comment);

export const insertCommentSchema = createInsertSchema(comment, {
  content: z.string().min(1),
  postId: z.string().min(1),
  parentCommentId: z.string().optional(),
  voteScore: z.number().default(0),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
});

export const updateCommentSchema = createInsertSchema(comment)
  .omit({
    id: true,
    createdBy: true,
    createdAt: true,
    postId: true,
    parentCommentId: true,
    voteScore: true,
  })
  .partial();

// Type Definitions
export type Comment = z.infer<typeof selectCommentSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
