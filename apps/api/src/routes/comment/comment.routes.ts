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
  insertCommentSchema,
  selectCommentSchema,
  updateCommentSchema,
} from "./comment.schema";

const tags: string[] = ["Comment"];

// List route definition with nested replies support
export const list = createRoute({
  tags,
  summary: "List comments for a post with nested replies",
  path: "/",
  method: "get",
  request: {
    query: z.object({
      ...queryParamsSchema.shape,
      postId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(
        z.array(
          selectCommentSchema.extend({
            replies: z.array(selectCommentSchema).optional(),
          })
        )
      ),
      "The list of comments with their replies"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the comments"
    ),
  },
});

// Create route definition with parent comment support
export const create = createRoute({
  tags,
  summary: "Create a new comment or reply",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertCommentSchema, "The comment to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectCommentSchema,
      "The created comment"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid parent comment or validation error"
    ),
  },
});

// Get One route definition with replies included
export const getOne = createRoute({
  tags,
  summary: "Get a single comment by ID with its replies",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCommentSchema.extend({
        replies: z.array(selectCommentSchema).optional(),
        user: z
          .object({
            id: z.string(),
            name: z.string(),
            image: z.string().nullable(),
          })
          .optional(),
        post: z
          .object({
            id: z.string(),
            title: z.string(),
          })
          .optional(),
      }),
      "Requested comment with replies"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Comment not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update route definition (parentCommentId cannot be modified)
export const update = createRoute({
  tags,
  summary: "Update an existing comment",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateCommentSchema, "The comment updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCommentSchema,
      "The updated comment"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Comment not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to update this comment"
    ),
  },
});

// Delete route definition with cascade delete for replies
export const remove = createRoute({
  tags,
  summary: "Delete a comment and its replies",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Comment and its replies deleted successfully",
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Comment not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to delete this comment"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
