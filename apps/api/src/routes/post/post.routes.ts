// import { createRoute, z } from "@hono/zod-openapi";
// import * as HttpStatusCodes from "stoker/http-status-codes";
// import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
// import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

// import { notFoundSchema } from "@/lib/constants";
// import {
//   errorMessageSchema,
//   getPaginatedSchema,
//   queryParamsSchema,
//   stringIdParamSchema,
// } from "@/lib/helpers";
// import {
//   insertPostSchema,
//   selectPostSchema,
//   updatePostSchema,
// } from "./post.schema";

// const tags: string[] = ["Post"];

// // Update the query params schema to include search
// const postQuerySchema = queryParamsSchema.extend({
//   search: z.string().optional(),
//   sort: z.enum(["asc", "desc"]).default("desc"),
//   status: z.enum(["published", "draft", "deleted"]).optional(),
// });

// export const list = createRoute({
//   tags,
//   summary: "List all posts",
//   path: "/",
//   method: "get",
//   request: {
//     query: postQuerySchema,
//   },
//   responses: {
//     [HttpStatusCodes.OK]: jsonContent(
//       getPaginatedSchema(z.array(selectPostSchema)),
//       "The list of posts"
//     ),
//     [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
//       errorMessageSchema,
//       "An error occurred while fetching the posts"
//     ),
//   },
// });

// const postCreateSchema = insertPostSchema.extend({
//   url: z.string().url().optional().or(z.literal("")),
//   content: z.string().optional().or(z.literal("")),
//   images: z.array(z.string()).optional().default([]),
// });

// export const create = createRoute({
//   tags,
//   summary: "Create a new post",
//   path: "/",
//   method: "post",
//   request: {
//     body: jsonContentRequired(postCreateSchema, "The post to create"),
//   },
//   responses: {
//     [HttpStatusCodes.CREATED]: jsonContent(
//       selectPostSchema,
//       "The created post"
//     ),
//     [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
//       errorMessageSchema,
//       "Unauthenticated request"
//     ),
//     [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
//       errorMessageSchema,
//       "The validation error(s)"
//     ),
//   },
// });

// export const getOne = createRoute({
//   tags,
//   summary: "Get a single post by ID",
//   method: "get",
//   path: "/{id}",
//   request: {
//     params: stringIdParamSchema,
//   },
//   responses: {
//     [HttpStatusCodes.OK]: jsonContent(selectPostSchema, "Requested post"),
//     [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found"),
//     [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(IdParamsSchema),
//       "Invalid ID format"
//     ),
//   },
// });

// export const update = createRoute({
//   tags,
//   summary: "Update an existing post",
//   path: "/{id}",
//   method: "put",
//   request: {
//     params: stringIdParamSchema,
//     body: jsonContentRequired(updatePostSchema, "The post updates"),
//   },
//   responses: {
//     [HttpStatusCodes.OK]: jsonContent(selectPostSchema, "The updated post"),
//     [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
//       errorMessageSchema,
//       "Unauthenticated request"
//     ),
//     [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found"),
//     [HttpStatusCodes.FORBIDDEN]: jsonContent(
//       errorMessageSchema,
//       "Not authorized to update this post"
//     ),
//     [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
//       errorMessageSchema,
//       "The validation error(s)"
//     ),
//   },
// });

// export const remove = createRoute({
//   tags,
//   summary: "Delete a post",
//   path: "/{id}",
//   method: "delete",
//   request: {
//     params: stringIdParamSchema,
//   },
//   responses: {
//     [HttpStatusCodes.NO_CONTENT]: {
//       description: "Post deleted successfully",
//     },
//     [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
//       errorMessageSchema,
//       "Unauthenticated request"
//     ),
//     [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found"),
//     [HttpStatusCodes.FORBIDDEN]: jsonContent(
//       errorMessageSchema,
//       "Not authorized to delete this post"
//     ),
//   },
// });

// export type ListRoute = typeof list;
// export type CreateRoute = typeof create;
// export type GetOneRoute = typeof getOne;
// export type UpdateRoute = typeof update;
// export type DeleteRoute = typeof remove;

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
  insertPostSchema,
  selectPostSchema,
  updatePostSchema,
} from "./post.schema";

const tags: string[] = ["Post"];

// Update the query params schema to include search and subforumId
const postQuerySchema = queryParamsSchema.extend({
  search: z.string().optional(),
  sort: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["published", "draft", "deleted"]).optional(),
  subforumId: z.string().optional(), // <--- ADD THIS LINE HERE
});

export const list = createRoute({
  tags,
  summary: "List all posts",
  path: "/",
  method: "get",
  request: {
    query: postQuerySchema, // This now includes subforumId
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectPostSchema)),
      "The list of posts"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the posts"
    ),
  },
});

const postCreateSchema = insertPostSchema.extend({
  url: z.string().url().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  images: z.array(z.string()).optional().default([]),
});

export const create = createRoute({
  tags,
  summary: "Create a new post",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(postCreateSchema, "The post to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPostSchema,
      "The created post"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single post by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPostSchema, "Requested post"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export const update = createRoute({
  tags,
  summary: "Update an existing post",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updatePostSchema, "The post updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPostSchema, "The updated post"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to update this post"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete a post",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Post deleted successfully",
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Post not found"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Not authorized to delete this post"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
