import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { events } from "@repo/database";
import { z } from "zod";

export const selectEventsSchema = createSelectSchema(events);

export const insertEventsSchema = createInsertSchema(events, {
  title: (val) => val.min(1).max(500),
  eventDate: z.string().transform((val) => new Date(val))
}).omit({
  createdBy: true,
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateEventsSchema = createInsertSchema(events)
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .partial();

// Type Definitions
export type Event = z.infer<typeof selectEventsSchema>;

export type InsertEvent = z.infer<typeof insertEventsSchema>;