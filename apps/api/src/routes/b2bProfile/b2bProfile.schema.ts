import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { b2bProfile } from "@repo/database";

export const selectB2bProfileSchema = createSelectSchema(b2bProfile);

export const insertB2bProfileSchema = createInsertSchema(b2bProfile, {
  username: (val) =>
    val
      .min(3)
      .max(50)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
  // Allow both URLs and base64 data URLs for images
  images: z
    .array(
      z.string().refine(
        (val) => {
          // Allow HTTP/HTTPS URLs and base64 data URLs
          return (
            z.string().url().safeParse(val).success || // Valid HTTP/HTTPS URL
            val.startsWith("data:image/") || // Base64 data URL
            val === "" || // Empty string
            val === "null" // String "null"
          );
        },
        {
          message:
            "Invalid image format. Must be a valid URL or base64 data URL.",
        }
      )
    )
    .default([])
    .optional(),
  businessName: (val) => val.min(1).max(200).optional(),
  businessType: z
    .enum([
      "Restaurant",
      "Retail",
      "Service",
      "Manufacturing",
      "Technology",
      "Healthcare",
      "Education",
      "Finance",
      "Real Estate",
      "Construction",
      "Transportation",
      "Entertainment",
      "Other",
    ])
    .optional(),
  contactPerson: (val) => val.min(1).max(100).optional(),
  phoneNumber: (val) =>
    val
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
      .optional(),
  address: (val) => val.min(1).max(500).optional(),
  subscriptionPlan: z.enum(["Basic", "Premium", "Enterprise"]).optional(),
  planExpiryDate: z.date().optional().nullable(), // Allow null values
  verified: z.boolean().default(false).optional(),
}).omit({
  id: true,
  userId: true, // Will be set from session
  createdAt: true,
  updatedAt: true,
});

export const updateB2bProfileSchema = createInsertSchema(b2bProfile)
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
      ), // Required - only mandatory field

    // Make images completely optional with flexible validation
    images: z
      .array(
        z.string().refine(
          (val) => {
            // Allow HTTP/HTTPS URLs, base64 data URLs, empty strings, and "null" strings
            return (
              z.string().url().safeParse(val).success || // Valid HTTP/HTTPS URL
              val.startsWith("data:image/") || // Base64 data URL
              val === "" || // Empty string
              val === "null" // String "null"
            );
          },
          {
            message:
              "Invalid image format. Must be a valid URL or base64 data URL.",
          }
        )
      )
      .optional(), // Completely optional for updates

    businessName: z.string().min(1).max(200).optional().or(z.literal("")), // Allow empty string
    businessType: z
      .enum([
        "Restaurant",
        "Retail",
        "Service",
        "Manufacturing",
        "Technology",
        "Healthcare",
        "Education",
        "Finance",
        "Real Estate",
        "Construction",
        "Transportation",
        "Entertainment",
        "Other",
      ])
      .optional(),
    contactPerson: z.string().min(1).max(100).optional().or(z.literal("")), // Allow empty string
    phoneNumber: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")), // Allow empty string
    address: z.string().min(1).max(500).optional().or(z.literal("")), // Allow empty string
    subscriptionPlan: z.enum(["Basic", "Premium", "Enterprise"]).optional(),
    planExpiryDate: z.date().optional().nullable(), // Allow null values
    verified: z.boolean().optional(),
  });

// Type Definitions
export type B2bProfile = z.infer<typeof selectB2bProfileSchema>;

export type InsertB2bProfile = z.infer<typeof insertB2bProfileSchema>;

export type UpdateB2bProfile = z.infer<typeof updateB2bProfileSchema>;

// Helper type for B2B profile with user details
export interface B2bProfileWithUser extends B2bProfile {
  user?: {
    id: string;
    name: string;
    image: string | null;
  };
}
