import { post } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectPostSchema = createSelectSchema(post);

export const insertPostSchema = createInsertSchema(post, {
  title: z.string().min(1).max(500),
  content: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  subforumId: z.string().min(1),
  status: z.enum(["published", "draft", "deleted"]).default("published"),
  voteScore: z.number().default(0),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
});

export const updatePostSchema = createInsertSchema(post)
  .omit({
    id: true,
    createdBy: true,
    createdAt: true,
    subforumId: true,
    voteScore: true,
  })
  .partial();

// Type Definitions
export type Post = z.infer<typeof selectPostSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
