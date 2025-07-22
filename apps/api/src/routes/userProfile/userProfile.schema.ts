import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { userProfile } from "@repo/database";

export const selectUserProfileSchema = createSelectSchema(userProfile);

export const insertUserProfileSchema = createInsertSchema(userProfile, {
  username: (val) =>
    val
      .min(3)
      .max(50)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
  images: z.array(z.string().url("Invalid image URL")).default([]).optional(), // Array of image URLs
  universityName: (val) => val.min(1).max(200).optional(),
  studentId: (val) => val.min(1).max(50).optional(),
  courseOfStudy: (val) => val.min(1).max(100).optional(),
  yearsOfStudy: z
    .enum([
      "1st Year",
      "2nd Year",
      "3rd Year",
      "4th Year",
      "Graduate",
      "Postgraduate",
    ])
    .optional(),
  interest: (val) => val.max(1000).optional(), // Longer for interests
}).omit({
  id: true,
  userId: true, // Will be set from session
  createdAt: true,
  updatedAt: true,
});

export const updateUserProfileSchema = createInsertSchema(userProfile)
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ), // Required
    images: z.array(z.string().url("Invalid image URL")).optional(), // Array of image URLs - optional for updates
    universityName: z.string().min(1).max(200).optional().or(z.literal("")), // Allow empty string
    studentId: z.string().min(1).max(50).optional().or(z.literal("")), // Allow empty string
    courseOfStudy: z.string().min(1).max(100).optional().or(z.literal("")), // Allow empty string
    yearsOfStudy: z
      .enum([
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Graduate",
        "Postgraduate",
      ])
      .optional(),
    interest: z.string().max(1000).optional().or(z.literal("")), // Allow empty string
  });

// Type Definitions
export type UserProfile = z.infer<typeof selectUserProfileSchema>;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

// Helper type for profile with user details
export interface UserProfileWithUser extends UserProfile {
  user?: {
    id: string;
    name: string;
    image: string | null;
  };
}
