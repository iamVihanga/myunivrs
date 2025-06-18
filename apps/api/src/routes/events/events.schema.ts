import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { events } from "@repo/database";

export const selectEventsSchema = createSelectSchema(events);

export const insertEventsSchema = createInsertSchema(events, {
  title: (val) => val.min(1).max(500),
  eventDate: z.string().transform((val) => new Date(val))
}).omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true
});

export const updateEventsSchema = createInsertSchema(events)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true
  })
  .extend({
    eventDate: z
      .string()
      .transform((val) => new Date(val))
      .optional()
  })
  .partial();

// Type Definitions
export type Events = z.infer<typeof selectEventsSchema>;

export type InsertEvents = z.infer<typeof insertEventsSchema>;

export type UpdateEvents = z.infer<typeof updateEventsSchema>;
