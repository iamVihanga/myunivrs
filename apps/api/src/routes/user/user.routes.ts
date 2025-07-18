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
  banUserSchema,
  insertUserSchema,
  selectUserSchema,
  unbanUserSchema,
  updateUserSchema,
} from "./user.schema";

const tags: string[] = ["User"];

// List users route
export const list = createRoute({
  tags,
  summary: "List all users",
  path: "/",
  method: "get",
  request: {
    query: z.object({
      ...queryParamsSchema.shape,
      role: z.enum(["user", "admin", "moderator"]).optional(),
      banned: z.boolean().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(
        z.array(
          selectUserSchema.extend({
            connections: z
              .object({
                following: z.number(),
                followers: z.number(),
              })
              .optional(),
            posts: z.number().optional(),
            lastActive: z.string().optional(),
          })
        )
      ),
      "The list of users"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching users"
    ),
  },
});

// Create user route
export const create = createRoute({
  tags,
  summary: "Create a new user",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema, "The user to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUserSchema,
      "The created user"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid user data"
    ),
  },
});

// Get one user route
export const getOne = createRoute({
  tags,
  summary: "Get a single user by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema.extend({
        connections: z
          .object({
            following: z.number(),
            followers: z.number(),
          })
          .optional(),
        posts: z.number().optional(),
        lastActive: z.string().optional(),
      }),
      "Requested user"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update user route
export const update = createRoute({
  tags,
  summary: "Update an existing user",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateUserSchema, "The user updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserSchema, "The updated user"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid user data"
    ),
  },
});

// Ban user route
export const ban = createRoute({
  tags,
  summary: "Ban a user",
  path: "/{id}/ban",
  method: "post",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(banUserSchema, "The ban details"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserSchema, "The banned user"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to ban users"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
  },
});

// Unban user route
export const unban = createRoute({
  tags,
  summary: "Unban a user",
  path: "/{id}/unban",
  method: "post",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(unbanUserSchema, "The unban details"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserSchema, "The unbanned user"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to unban users"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
  },
});

// Delete user route
export const remove = createRoute({
  tags,
  summary: "Delete a user",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "User deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to delete users"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found"),
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
export type BanRoute = typeof ban;
export type UnbanRoute = typeof unban;
export type DeleteRoute = typeof remove;
