import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { media, mediaTypeEnum } from "@repo/database";

export const mediaTypeSchema = createSelectSchema(mediaTypeEnum);

export type MediaType = z.infer<typeof mediaTypeSchema>;

export const mediaSchema = createSelectSchema(media);

export type Media = z.infer<typeof mediaSchema>;

export const mediaUploadSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type MediaUploadType = z.infer<typeof mediaUploadSchema>;

export const mediaUpdateSchema = createInsertSchema(media)
  .omit({
    id: true,
    createdAt: true,
    type: true
  })
  .partial();

export type MediaUpdateType = z.infer<typeof mediaUpdateSchema>;
