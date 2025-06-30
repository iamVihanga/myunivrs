import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@/lib/helpers";

import {
  insertImagesSchema,
  selectImagesSchema,
  updateImagesSchema,
} from "./images.schema";

const tags: string[] = ["Images"];

// List all images
export const list = createRoute({
  tags,
  summary: "List all images",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectImagesSchema)),
      "List of all image records"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the images"
    ),
  },
});

// Create a new image
export const create = createRoute({
  tags,
  summary: "Upload a new image",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertImagesSchema, "The image entry to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectImagesSchema,
      "The created image entry"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Get a single image by ID
export const getOne = createRoute({
  tags,
  summary: "Get a single image by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectImagesSchema,
      "The requested image"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Image not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID"
    ),
  },
});

// Update an image
export const update = createRoute({
  tags,
  summary: "Update an image record",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateImagesSchema, "The image update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectImagesSchema, "The updated image"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Image not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Delete an image
export const remove = createRoute({
  tags,
  summary: "Delete an image",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Image deleted successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Image not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID"
    ),
  },
});

// Export route types
export type ListImageRoute = typeof list;
export type CreateImageRoute = typeof create;
export type GetOneImageRoute = typeof getOne;
export type UpdateImageRoute = typeof update;
export type DeleteImageRoute = typeof remove;
