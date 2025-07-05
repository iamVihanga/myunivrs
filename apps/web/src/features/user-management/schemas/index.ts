import { z } from "zod";

// Create user schema for form validation
export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "Name is required"
      })
      .max(100, {
        message: "Name must be 100 characters or less"
      }),
    email: z.string().email({
      message: "Please enter a valid email address"
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long"
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required"
    }),
    role: z.enum(["user", "admin"], {
      message: "Please select a valid role"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

// Type definition
export type CreateUserSchema = z.infer<typeof createUserSchema>;
