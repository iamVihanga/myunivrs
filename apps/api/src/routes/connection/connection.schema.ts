// connection.schema.ts

import { connections } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema (for querying)
export const selectConnectionSchema = createSelectSchema(connections);

// Insert schema (for creating requests)
export const insertConnectionSchema = createInsertSchema(connections, {
  receiverId: z.string().min(1, "Receiver ID is required"),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
}).omit({
  id: true, // Will be auto-generated
  senderId: true, // Will be set from session
  createdAt: true,
  updatedAt: true,
});

// Update schema (for accepting/rejecting requests)
export const updateConnectionSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected"]),
});

// Parameter schema for routes
export const connectionParamSchema = z.object({
  id: z.string().min(1, "Connection ID is required"),
});

// TypeScript Types
export type Connection = z.infer<typeof selectConnectionSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type UpdateConnection = z.infer<typeof updateConnectionSchema>;
export type ConnectionParam = z.infer<typeof connectionParamSchema>;

// Helper type for connection with user details
export interface ConnectionWithUsers extends Connection {
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string;
    image: string | null;
  };
}
