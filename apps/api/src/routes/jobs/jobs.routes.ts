import { notFoundSchema } from "@/lib/constants";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@/lib/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import {
  insertJobsSchema,
  selectJobSchema,
  updateJobsSchema,
} from "./jobs.schema";

const tags: string[] = ["Jobs"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all jobs entries",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectJobSchema)),
      "The list of job entries"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the job entries"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new job entry",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertJobsSchema, "The job entry to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectJobSchema,
      "The created job entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single job entry by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectJobSchema, "Requested job entry"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Job entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing job entry",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateJobsSchema, "The job entry to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectJobSchema, "The updated job entry"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Job entry not found"
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
  summary: "Delete a job entry",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Job entry deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Job entry not found"
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
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
