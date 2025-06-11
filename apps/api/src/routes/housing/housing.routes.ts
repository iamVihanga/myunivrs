import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import { insertHousingSchema, selectHousingSchema } from "./housing.schema";

const tags: string[] = ["Housing"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all housing entries",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectHousingSchema),
      "The list of housing entries"
    )
  }
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new housing entry",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertHousingSchema,
      "The housing entry to create"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectHousingSchema,
      "The created housing entry"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    )
  }
});

export const getOne = createRoute({
  tags,
  summary: "Get a single housing entry by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectHousingSchema,
      "Requested housing entry"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Housing entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
