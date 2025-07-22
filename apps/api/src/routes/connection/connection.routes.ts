import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/lib/constants";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
} from "@/lib/helpers";
import {
  connectionParamSchema,
  insertConnectionSchema,
  selectConnectionSchema,
  updateConnectionSchema,
} from "./connection.schema";

const tags: string[] = ["Connection"];

export const list = createRoute({
  tags,
  summary: "List all connections",
  path: "/",
  method: "get",
  request: {
    query: z.object({
      ...queryParamsSchema.shape,
      status: z.enum(["pending", "accepted", "rejected"]).optional(),
      type: z.enum(["sent", "received"]).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(
        z.array(
          selectConnectionSchema.extend({
            sender: z.object({
              id: z.string(),
              name: z.string(),
              image: z.string().nullable(),
            }),
            receiver: z.object({
              id: z.string(),
              name: z.string(),
              image: z.string().nullable(),
            }),
          })
        )
      ),
      "The list of connections"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the connections"
    ),
  },
});

export const create = createRoute({
  tags,
  summary: "Send a connection request",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertConnectionSchema,
      "The connection request to send"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectConnectionSchema.extend({
        sender: z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
        }),
        receiver: z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
        }),
      }),
      "The created connection request"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid connection request or already exists"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single connection by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: connectionParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectConnectionSchema.extend({
        sender: z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
        }),
        receiver: z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().nullable(),
        }),
      }),
      "Requested connection"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Connection not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(connectionParamSchema),
      "Invalid ID format"
    ),
  },
});

export const update = createRoute({
  tags,
  summary: "Update connection status (accept/reject)",
  path: "/{id}",
  method: "put",
  request: {
    params: connectionParamSchema,
    body: jsonContentRequired(
      updateConnectionSchema,
      "The connection status update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectConnectionSchema,
      "The updated connection"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to update this connection"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Connection not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid status update"
    ),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete a connection",
  path: "/{id}",
  method: "delete",
  request: {
    params: connectionParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Connection deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to delete this connection"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Connection not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(connectionParamSchema),
      "Invalid ID format"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
