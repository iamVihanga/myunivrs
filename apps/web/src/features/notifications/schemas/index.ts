import { notifications } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema (for reading notifications)
export const selectNotificationSchema = createSelectSchema(notifications);

// Insert schema (for creating notifications)
export const insertNotificationSchema = createInsertSchema(notifications, {
  userId: z.string(),
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  read: z.boolean().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (for updating notifications)
export const updateNotificationSchema = createInsertSchema(notifications, {
  title: z.string().min(1).max(200).optional(),
  message: z.string().optional(),
  read: z.boolean().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  })
  .partial();

// Type Definitions
export type Notification = z.infer<typeof selectNotificationSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type UpdateNotification = z.infer<typeof updateNotificationSchema>;
