import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@/lib/helpers";
import {
  insertSellSwapSchema,
  selectSellSwapSchema,
  updateSellSwapSchema
} from "./sellswaps.schema";

const tags: string[] = ["Sell Swaps"];

// Extend query params to include type filter
const sellSwapQueryParams = queryParamsSchema.extend({
  type: z.enum(["sell", "swap"]).optional(),
  categoryId: z.string().optional()
});

// List route definition
export const list = createRoute({
  tags,
  summary: "List all sell/swap items",
  path: "/",
  method: "get",
  request: {
    query: sellSwapQueryParams
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectSellSwapSchema)),
      "The list of sell/swap items"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching sell/swap items"
    )
  }
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new sell/swap item",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertSellSwapSchema,
      "The sell/swap item to create"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectSellSwapSchema,
      "The created sell/swap item"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    )
  }
});

export const getOne = createRoute({
  tags,
  summary: "Get a single sell/swap item by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSellSwapSchema,
      "Requested sell/swap item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Sell/swap item not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing sell/swap item",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateSellSwapSchema,
      "The sell/swap item to update"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSellSwapSchema,
      "The updated sell/swap item"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Action Forbidden"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Sell/swap item not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    )
  }
});

// Delete route definition
export const remove = createRoute({
  tags,
  summary: "Delete a sell/swap item",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Sell/swap item deleted successfully"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Action Forbidden"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Sell/swap item not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

// Get by category route definition
export const getByCategory = createRoute({
  tags,
  summary: "Get sell/swap items by category ID",
  method: "get",
  path: "/category/{id}",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectSellSwapSchema)),
      "Sell/swap items in this category"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

// Get my listings route definition
export const getMyListings = createRoute({
  tags,
  summary: "Get sell/swap items created by the current user",
  method: "get",
  path: "/my-listings",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectSellSwapSchema)),
      "User's sell/swap items"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the listings"
    )
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
export type GetByCategoryRoute = typeof getByCategory;
export type GetMyListingsRoute = typeof getMyListings;
