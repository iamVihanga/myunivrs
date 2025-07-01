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
  insertAdsSchema,
  selectAdsSchema,
  updateAdsSchema,
} from "./ads.schema";

const tags: string[] = ["Ads"];

// List all ads
export const list = createRoute({
  tags,
  summary: "List all ads",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectAdsSchema)),
      "List of ads"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Error while fetching ads"
    ),
  },
});

// Create an ad
export const create = createRoute({
  tags,
  summary: "Create a new ad",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertAdsSchema, "Ad to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectAdsSchema, "Created ad"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Get single ad
export const getOne = createRoute({
  tags,
  summary: "Get an ad by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectAdsSchema, "Ad details"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Ad not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update ad
export const update = createRoute({
  tags,
  summary: "Update an existing ad",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateAdsSchema, "Ad to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectAdsSchema, "Updated ad"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Ad not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Delete ad
export const remove = createRoute({
  tags,
  summary: "Delete an ad",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Ad deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Ad not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Route types
export type ListAdsRoute = typeof list;
export type CreateAdsRoute = typeof create;
export type GetOneAdRoute = typeof getOne;
export type UpdateAdRoute = typeof update;
export type DeleteAdRoute = typeof remove;
