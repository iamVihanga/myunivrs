import { pollVote } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for poll votes
export const selectPollVoteSchema = createSelectSchema(pollVote);

// Insert schema for poll votes
export const insertPollVoteSchema = createInsertSchema(pollVote, {
  pollId: z.string().min(1),
  optionId: z.string().min(1),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Update schema for poll votes (though updates might not be needed for votes)
export const updatePollVoteSchema = createInsertSchema(pollVote)
  .omit({
    id: true,
    pollId: true,
    optionId: true,
    userId: true,
    createdAt: true,
  })
  .partial();

// Type Definitions
export type PollVote = z.infer<typeof selectPollVoteSchema>;
export type InsertPollVote = z.infer<typeof insertPollVoteSchema>;
export type UpdatePollVote = z.infer<typeof updatePollVoteSchema>;

// Helper type for vote with related data
export interface PollVoteWithDetails extends PollVote {
  poll?: {
    question: string;
  };
  option?: {
    optionText: string;
  };
  user?: {
    name: string;
  };
}
