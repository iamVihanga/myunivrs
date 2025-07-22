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
  insertB2bProfileSchema,
  selectB2bProfileSchema,
  updateB2bProfileSchema,
} from "./b2bProfile.schema";

const tags: string[] = ["B2bProfile"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all B2B profiles",
  path: "/",
  method: "get",
  request: {
    query: z.object({
      ...queryParamsSchema.shape,
      username: z.string().optional(),
      businessName: z.string().optional(),
      businessType: z
        .enum([
          "Restaurant",
          "Retail",
          "Service",
          "Manufacturing",
          "Technology",
          "Healthcare",
          "Education",
          "Finance",
          "Real Estate",
          "Construction",
          "Transportation",
          "Entertainment",
          "Other",
        ])
        .optional(),
      subscriptionPlan: z.enum(["Basic", "Premium", "Enterprise"]).optional(),
      verified: z.enum(["true", "false"]).optional(),
      hasImages: z.enum(["true", "false"]).optional(), // Filter by whether profile has images
      address: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectB2bProfileSchema)),
      "The list of B2B profile entries"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the B2B profile entries"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new B2B profile entry",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertB2bProfileSchema,
      "The B2B profile entry to create"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectB2bProfileSchema,
      "The created B2B profile entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single B2B profile entry by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectB2bProfileSchema,
      "Requested B2B profile entry"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "B2B profile entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Get current user's B2B profile
export const getMe = createRoute({
  tags,
  summary: "Get current user's B2B profile",
  method: "get",
  path: "/me",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectB2bProfileSchema,
      "Current user's B2B profile"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "B2B profile not found"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing B2B profile entry",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateB2bProfileSchema,
      "The B2B profile entry to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectB2bProfileSchema,
      "The updated B2B profile entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to update this profile"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "B2B profile entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Update current user's B2B profile
export const updateMe = createRoute({
  tags,
  summary: "Update current user's B2B profile",
  path: "/me",
  method: "put",
  request: {
    body: jsonContentRequired(
      updateB2bProfileSchema,
      "The B2B profile updates"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectB2bProfileSchema,
      "The updated B2B profile"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Delete route definition
export const remove = createRoute({
  tags,
  summary: "Delete a B2B profile entry",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "B2B profile entry deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to delete this profile"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "B2B profile entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type GetMeRoute = typeof getMe;
export type UpdateRoute = typeof update;
export type UpdateMeRoute = typeof updateMe;
export type DeleteRoute = typeof remove;
