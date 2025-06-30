import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { media, mediaTypeEnum } from "@repo/database";

export const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional()
});

export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

export const mediaTypeSchema = createSelectSchema(mediaTypeEnum);

export type MediaType = z.infer<typeof mediaTypeSchema>;

export const mediaSchema = createSelectSchema(media);

export type Media = z.infer<typeof mediaSchema>;

export interface Progress {
  loaded: number;
  total: number;
  percentage: number;
  key: string;
}

export interface UploadParams {
  file: File;
  type?: MediaType;
  path?: string;

  onProgress: (progress: Progress) => void;
}

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

const PROJECT_FOLDER = "myunivrs";

export enum MediaUploadPaths {
  GALLERY = `${PROJECT_FOLDER}/gallery`
}
