import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import {
  insertUniversitySchema,
  selectUniversitySchema,
  updateUniversitySchema,
} from "./university.schema";

const tags: string[] = ["University"];

// List all universities
export const list = createRoute({
  tags,
  summary: "List all universities",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUniversitySchema),
      "The list of universities"
    ),
  },
});

// Create a new university
export const create = createRoute({
  tags,
  summary: "Create a new university",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertUniversitySchema,
      "The university to create"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUniversitySchema,
      "The created university"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUniversitySchema),
      "Validation error(s)"
    ),
  },
});

// Get a single university by ID
export const getOne = createRoute({
  tags,
  summary: "Get a single university",
  method: "get",
  path: "/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUniversitySchema,
      "Requested university"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "University not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update a university by ID (partial update)
export const patch = createRoute({
  tags,
  summary: "Update a university",
  path: "/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateUniversitySchema, "The university updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUniversitySchema,
      "Updated university"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "University not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateUniversitySchema).or(
        createErrorSchema(IdParamsSchema)
      ),
      "Validation error(s)"
    ),
  },
});

// Remove a university by ID
export const remove = createRoute({
  tags,
  summary: "Remove a university",
  path: "/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "University deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "University not found"
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
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
