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
  insertB2BPlanSchema,
  selectB2BPlanSchema,
  updateB2BPlanSchema,
} from "./b2bplans.schema";

const tags = ["B2B Plans"];

// List all B2B plans
export const list = createRoute({
  tags,
  summary: "List all B2B plans",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectB2BPlanSchema)),
      "List of B2B plans"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Error while fetching B2B plans"
    ),
  },
});

// Create a new B2B plan
export const create = createRoute({
  tags,
  summary: "Create a new B2B plan",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertB2BPlanSchema, "B2B plan to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectB2BPlanSchema,
      "Created B2B plan"
    ),
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

// Get a single B2B plan by ID
export const getOne = createRoute({
  tags,
  summary: "Get a B2B plan by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectB2BPlanSchema, "B2B plan details"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Plan not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update an existing B2B plan
export const update = createRoute({
  tags,
  summary: "Update an existing B2B plan",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateB2BPlanSchema, "B2B plan to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectB2BPlanSchema, "Updated B2B plan"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Plan not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Delete a B2B plan
export const remove = createRoute({
  tags,
  summary: "Delete a B2B plan",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "B2B plan deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Plan not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Route types
export type ListB2BPlanRoute = typeof list;
export type CreateB2BPlanRoute = typeof create;
export type GetOneB2BPlanRoute = typeof getOne;
export type UpdateB2BPlanRoute = typeof update;
export type DeleteB2BPlanRoute = typeof remove;
