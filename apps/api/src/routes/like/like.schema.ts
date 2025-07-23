import { like } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Schema for selecting likes (includes all fields)
export const selectLikeSchema = createSelectSchema(like, {
  postId: z.string().optional(),
  commentId: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean().default(true),
});

// Schema for inserting likes (omits id, createdAt)
export const insertLikeSchema = selectLikeSchema
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    voteType: z.enum(["upvote", "downvote"]).optional(), // Add this field
  });

// Schema for updating likes (all fields optional, omits id, createdAt)
export const updateLikeSchema = createInsertSchema(like, {
  postId: z.string().min(1, "Post ID is required").optional(),
  commentId: z.string().min(1, "Comment ID is required").optional(),
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean().default(true),
})
  .omit({
    id: true,
    createdAt: true,
  })
  .partial()
  .refine(
    (data) => {
      // If either postId or commentId is provided, ensure only one is provided
      if (data.postId !== undefined || data.commentId !== undefined) {
        return !(data.postId && data.commentId);
      }
      return true;
    },
    {
      message: "Cannot like both post and comment simultaneously",
      path: ["commentId"],
    }
  );

// Toggle like schema (for like/unlike actions)
export const toggleLikeSchema = z
  .object({
    postId: z.string().optional().or(z.literal("")),
    commentId: z.string().optional().or(z.literal("")),
    userId: z.string().min(1, "User ID is required"),
  })
  .transform((data) => ({
    ...data,
    postId: data.postId === "" ? undefined : data.postId,
    commentId: data.commentId === "" ? undefined : data.commentId,
  }))
  .refine((data) => data.postId || data.commentId, {
    message: "Either postId or commentId must be provided",
    path: ["postId"],
  })
  .refine((data) => !(data.postId && data.commentId), {
    message: "Cannot specify both postId and commentId",
    path: ["commentId"],
  });

// Like count schema (for aggregation responses)
export const likeCountSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  count: z.number().nonnegative(),
  userHasLiked: z.boolean().optional(),
});

// User like status schema (to check if user has liked an item)
export const userLikeStatusSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  hasLiked: z.boolean(),
});

// Export type definitions
export type Like = z.infer<typeof selectLikeSchema>;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type UpdateLike = z.infer<typeof updateLikeSchema>;
export type ToggleLike = z.infer<typeof toggleLikeSchema>;
export type LikeCount = z.infer<typeof likeCountSchema>;
export type UserLikeStatus = z.infer<typeof userLikeStatusSchema>;
