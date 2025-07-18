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
  insertPollSchema,
  selectPollSchema,
  updatePollSchema,
} from "./poll.schema";

const tags: string[] = ["Poll"];

export const list = createRoute({
  tags,
  summary: "List all polls with their options",
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
          selectPollSchema.extend({
            options: z
              .array(
                z.object({
                  id: z.string(),
                  optionText: z.string(),
                  voteCount: z.number(),
                })
              )
              .optional(),
          })
        )
      ),
      "The list of polls with their options"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the polls"
    ),
  },
});

export const create = createRoute({
  tags,
  summary: "Create a new poll with options",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertPollSchema.extend({
        options: z
          .array(
            z.object({
              optionText: z.string().min(1).max(200),
            })
          )
          .min(2)
          .max(10),
      }),
      "The poll to create with its options"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPollSchema.extend({
        options: z.array(
          z.object({
            id: z.string(),
            optionText: z.string(),
            voteCount: z.number(),
          })
        ),
      }),
      "The created poll with options"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid poll data"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single poll by ID with its options",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPollSchema.extend({
        options: z.array(
          z.object({
            id: z.string(),
            optionText: z.string(),
            voteCount: z.number(),
          })
        ),
      }),
      "Requested poll with options"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Poll not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export const update = createRoute({
  tags,
  summary: "Update an existing poll",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updatePollSchema, "The poll updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPollSchema.extend({
        options: z.array(
          z.object({
            id: z.string(),
            optionText: z.string(),
            voteCount: z.number(),
          })
        ),
      }),
      "The updated poll"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Poll not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid poll data"
    ),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete a poll and its options",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Poll deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Poll not found"),
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
export type DeleteRoute = typeof remove;
