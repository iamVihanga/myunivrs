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
import { insertVendorSchema, selectVendorSchema } from "./vendor.schema";

const tags: string[] = ["Vendor"];

// List vendors
export const list = createRoute({
  tags,
  summary: "List all vendors",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectVendorSchema)),
      "The list of vendors"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching vendors"
    ),
  },
});

// Create vendor
export const create = createRoute({
  tags,
  summary: "Create a new vendor",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertVendorSchema, "The vendor to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectVendorSchema,
      "The created vendor"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Get one vendor
export const getOne = createRoute({
  tags,
  summary: "Get a vendor by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectVendorSchema, "The vendor data"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Vendor not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID"
    ),
  },
});

// Update vendor
export const update = createRoute({
  tags,
  summary: "Update a vendor by ID",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(insertVendorSchema, "The vendor to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectVendorSchema, "Vendor updated"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Vendor not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
  },
});

// Delete vendor
export const remove = createRoute({
  tags,
  summary: "Delete a vendor",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Vendor deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Vendor not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
