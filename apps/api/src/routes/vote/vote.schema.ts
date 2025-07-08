import { vote } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectVoteSchema = createSelectSchema(vote);

export const insertVoteSchema = createInsertSchema(vote, {
  value: z.number().min(-1).max(1),
  postId: z.string().optional(),
  commentId: z.string().optional(),
})
  .omit({
    id: true,
    userId: true,
    createdAt: true,
  })
  .refine((data) => data.postId || data.commentId, {
    message: "Either postId or commentId must be provided",
  });

export const updateVoteSchema = createInsertSchema(vote)
  .pick({
    value: true,
  })
  .refine((data) => data.value === 1 || data.value === -1, {
    message: "Vote value must be either 1 (upvote) or -1 (downvote)",
  });

// Type Definitions
export type Vote = z.infer<typeof selectVoteSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type UpdateVote = z.infer<typeof updateVoteSchema>;
