// connection.schema.ts

import { connections } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema (for querying)
export const selectConnectionSchema = createSelectSchema(connections);

// Insert schema (for creating requests)
export const insertConnectionSchema = createInsertSchema(connections, {
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  status: z
    .enum(["pending", "accepted", "rejected"])
    .optional()
    .default("pending"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (for accepting/rejecting requests)
export const updateConnectionSchema = createInsertSchema(connections, {
  status: z.enum(["pending", "accepted", "rejected"]),
}).omit({
  id: true,
  senderId: true,
  receiverId: true,
  createdAt: true,
  updatedAt: true,
});

// TypeScript Types
export type Connection = z.infer<typeof selectConnectionSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type UpdateConnection = z.infer<typeof updateConnectionSchema>;

export interface UserDetails {
  id: string;
  name: string;
  image: string | null;
  email: string;
}

export interface ConnectionWithUsers extends Connection {
  sender: UserDetails;
  receiver: UserDetails;
  createdAt: Date | null;
  updatedAt: Date | null;
}
