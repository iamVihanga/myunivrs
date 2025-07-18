import { user } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for users
export const selectUserSchema = createSelectSchema(user);

// Insert schema for new users
export const insertUserSchema = createInsertSchema(user, {
  name: z.string().min(1).max(100),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  image: z.string().url().nullable().optional(),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  banned: z.boolean().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.string().datetime().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema for existing users
export const updateUserSchema = createInsertSchema(user, {
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  emailVerified: z.boolean().optional(),
  image: z.string().url().nullable().optional(),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  banned: z.boolean().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.string().datetime().nullable().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Ban user schema
export const banUserSchema = z.object({
  banned: z.literal(true),
  banReason: z.string().min(1),
  banExpires: z.string().datetime().optional(),
});

// Unban user schema
export const unbanUserSchema = z.object({
  banned: z.literal(false),
  banReason: z.null(),
  banExpires: z.null(),
});

// Type Definitions
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type BanUser = z.infer<typeof banUserSchema>;
export type UnbanUser = z.infer<typeof unbanUserSchema>;

// Helper interface for user with additional data
export interface UserWithMeta extends User {
  connections?: {
    following: number;
    followers: number;
  };
  posts?: number;
  lastActive?: string;
}
