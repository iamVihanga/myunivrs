import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { aboutus } from "@repo/database";

export const selectAboutusSchema = createSelectSchema(aboutus);

export const updateAboutusSchema = createInsertSchema(aboutus)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
  })
  .extend({
    eventDate: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
  })
  .partial();

// Type Definitions
export type AboutUs = z.infer<typeof selectAboutusSchema>;

export type UpdateAboutUs = z.infer<typeof updateAboutusSchema>;
