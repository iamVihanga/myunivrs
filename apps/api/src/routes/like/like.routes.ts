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
  insertLikeSchema,
  likeCountSchema,
  selectLikeSchema,
  toggleLikeSchema,
  updateLikeSchema,
  userLikeStatusSchema,
} from "./like.schema";

const tags: string[] = ["Likes"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all likes entries",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema.extend({
      postId: z.string().optional(),
      commentId: z.string().optional(),
      userId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectLikeSchema)),
      "The list of like entries"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the like entries"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new like entry",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertLikeSchema, "The like entry to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectLikeSchema,
      "The created like entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      errorMessageSchema,
      "Like already exists"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Get single like entry
export const getOne = createRoute({
  tags,
  summary: "Get a single like entry by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectLikeSchema, "Requested like entry"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Like entry not found"
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
  summary: "Update an existing like entry",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateLikeSchema, "The like entry to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectLikeSchema,
      "The updated like entry"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Like entry not found"
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
  summary: "Delete a like entry",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Like entry deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Like entry not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Toggle like route (like/unlike functionality)
export const toggle = createRoute({
  tags,
  summary: "Toggle like/unlike for a post or comment",
  path: "/toggle",
  method: "post",
  request: {
    body: jsonContentRequired(toggleLikeSchema, "The like toggle data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
        action: z.enum(["liked", "unliked"]),
        like: selectLikeSchema.optional(),
      }),
      "Like toggled successfully"
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

// Get like count for post or comment
export const getCount = createRoute({
  tags,
  summary: "Get like count for a post or comment",
  path: "/count",
  method: "get",
  request: {
    query: z
      .object({
        postId: z.string().optional(),
        commentId: z.string().optional(),
        userId: z.string().optional(),
      })
      .refine((data) => data.postId || data.commentId, {
        message: "Either postId or commentId must be provided",
      }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      likeCountSchema,
      "Like count retrieved successfully"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Check if user has liked a post or comment
export const getUserStatus = createRoute({
  tags,
  summary: "Check if user has liked a post or comment",
  path: "/status",
  method: "get",
  request: {
    query: z
      .object({
        postId: z.string().optional(),
        commentId: z.string().optional(),
        userId: z.string().min(1, "User ID is required"),
      })
      .refine((data) => data.postId || data.commentId, {
        message: "Either postId or commentId must be provided",
      }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userLikeStatusSchema,
      "User like status retrieved successfully"
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

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type ToggleRoute = typeof toggle;
export type GetCountRoute = typeof getCount;
export type GetUserStatusRoute = typeof getUserStatus;
