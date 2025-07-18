import { poll, pollOption } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schemas for both poll and poll options
export const selectPollSchema = createSelectSchema(poll);
export const selectPollOptionSchema = createSelectSchema(pollOption);

// Insert schema for poll
export const insertPollSchema = createInsertSchema(poll, {
  question: z.string().min(1).max(500),
  postId: z.string().min(1),
  expiresAt: z.string().datetime().optional(),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
});

// Insert schema for poll options
export const insertPollOptionSchema = createInsertSchema(pollOption, {
  pollId: z.string().min(1),
  optionText: z.string().min(1).max(200),
  voteCount: z.number().default(0),
}).omit({
  id: true,
  createdAt: true,
});

// Update schema for poll
export const updatePollSchema = createInsertSchema(poll)
  .omit({
    id: true,
    postId: true,
    createdBy: true,
    createdAt: true,
  })
  .partial();

// Update schema for poll options
export const updatePollOptionSchema = createInsertSchema(pollOption)
  .omit({
    id: true,
    pollId: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type Poll = z.infer<typeof selectPollSchema>;
export type PollOption = z.infer<typeof selectPollOptionSchema>;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type InsertPollOption = z.infer<typeof insertPollOptionSchema>;
export type UpdatePoll = z.infer<typeof updatePollSchema>;
export type UpdatePollOption = z.infer<typeof updatePollOptionSchema>;

// Helper type for poll with options
export interface PollWithOptions extends Poll {
  options?: PollOption[];
}
