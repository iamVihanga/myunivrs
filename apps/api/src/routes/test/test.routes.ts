import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import {
  insertTestSchema,
  selectTestSchema,
  updateTestSchema,
} from "./test.schema";

const tags: string[] = ["Test"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all tests",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTestSchema),
      "The list of tests"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new test",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertTestSchema, "The task to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectTestSchema,
      "The created test"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTestSchema),
      "The validation error(s)"
    ),
  },
});

// Get single test route definition
export const getOne = createRoute({
  tags,
  summary: "Get a single test",
  method: "get",
  path: "/{id}",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTestSchema, "Requested task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Patch route definition
export const patch = createRoute({
  tags,
  summary: "Update a test",
  path: "/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateTestSchema, "The task updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTestSchema, "The updated task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateTestSchema).or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)"
    ),
  },
});

// Remove test route definition
export const remove = createRoute({
  tags,
  summary: "Remove a test",
  path: "/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "test deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Test not found"),
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
