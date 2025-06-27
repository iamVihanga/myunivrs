import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { errorMessageSchema, queryParamsSchema } from "@/lib/helpers";
import { selectAboutusSchema, updateAboutusSchema } from "./aboutus.schema";

const tags: string[] = ["AboutUs"];

// List route definition
export const get = createRoute({
  tags,
  summary: "Get About us content",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectAboutusSchema, // Not paginated
      "The About us content"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "About us content not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the about us content"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing About-Us Content",
  path: "/{id}",
  method: "put",
  request: {
    body: jsonContentRequired(
      updateAboutusSchema,
      "The About-Us entry to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectAboutusSchema,
      "The updated About-Us Content"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "event entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export type UpdateRoute = typeof update;
export type GetRoute = typeof get;
