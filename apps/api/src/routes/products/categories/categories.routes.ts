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
  insertProductCategorySchema,
  selectProductCategorySchema,
  updateProductCategorySchema
} from "./categories.schema";

const tags: string[] = ["Product Categories"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all product categories",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectProductCategorySchema)),
      "The list of product categories"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching product categories"
    )
  }
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new product category",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertProductCategorySchema,
      "The product category to create"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectProductCategorySchema,
      "The created product category"
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
  summary: "Get a single product category by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProductCategorySchema,
      "Requested product category"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Product category not found"
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
  summary: "Update an existing product category",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateProductCategorySchema,
      "The product category to update"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProductCategorySchema,
      "The updated product category"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Product category not found"
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
  summary: "Delete a product category",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Product category deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Product category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

// Get products by category route definition
export const getProducts = createRoute({
  tags,
  summary: "Get products by category ID",
  method: "get",
  path: "/{id}/products",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(z.any())), // Using z.any() since we don't have direct access to product schema here
      "Products in this category"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Product category not found"
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
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
export type GetProductsRoute = typeof getProducts;
