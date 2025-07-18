import { pollOption } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for poll options
export const selectPollOptionSchema = createSelectSchema(pollOption);

// Insert schema for poll options
export const insertPollOptionSchema = createInsertSchema(pollOption, {
  pollId: z.string().min(1),
  optionText: z.string().min(1).max(200),
  voteCount: z.number().default(0),
}).omit({
  id: true,
  createdAt: true,
});

// Update schema for poll options
export const updatePollOptionSchema = createInsertSchema(pollOption)
  .omit({
    id: true,
    pollId: true, // Don't allow changing poll association
    createdAt: true,
  })
  .partial();

// Type Definitions
export type PollOption = z.infer<typeof selectPollOptionSchema>;
export type InsertPollOption = z.infer<typeof insertPollOptionSchema>;
export type UpdatePollOption = z.infer<typeof updatePollOptionSchema>;

// Helper type for option with vote details
export interface PollOptionWithDetails extends PollOption {
  poll?: {
    question: string;
  };
  votes?: {
    count: number;
    hasVoted?: boolean;
  };
}
